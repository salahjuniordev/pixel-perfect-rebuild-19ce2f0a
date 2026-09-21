import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

/**
 * Client-side image compression: keeps storage (and upload time) small by
 * resizing in-browser before anything touches Supabase storage.
 *
 * - Images wider than maxWidth are downscaled (default 1920px — plenty for
 *   hero/gallery/og use, retina included).
 * - Re-encoded as WebP at 0.82 quality (typically 3-10x smaller than a
 *   camera PNG/JPEG).
 * - Skipped when the compressed result isn't actually smaller than the
 *   original (tiny images, already-optimized WebP) or for GIFs/videos.
 */
async function compressImage(file: File, maxWidth = 1920, quality = 0.82): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxWidth / bitmap.width);
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", quality),
    );
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".webp", { type: "image/webp" });
  } catch {
    // Decode failure (unsupported format etc.) — upload the original as-is.
    return file;
  }
}

export function MediaUpload({
  value,
  onChange,
  accept = "image/*,video/*",
  label = "Upload media",
}: {
  value?: string | null;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);

  const handle = async (rawFile: File) => {
    if (!rawFile) return;
    if (rawFile.size > 50 * 1024 * 1024) {
      toast.error("File too large (max 50MB)");
      return;
    }
    setUploading(true);
    try {
      const file = await compressImage(rawFile);
      const ext = file.name.split(".").pop() || "bin";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("media").upload(path, file, {
        cacheControl: "31536000",
        upsert: false,
        contentType: file.type,
      });
      if (error) throw error;
      const { data, error: sErr } = await supabase.storage
        .from("media")
        .createSignedUrl(path, TEN_YEARS);
      if (sErr || !data?.signedUrl) throw sErr ?? new Error("Sign failed");
      onChange(data.signedUrl);
      toast.success("Uploaded");
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const isVideo = value && /\.(mp4|webm|mov)(\?|$)/i.test(value);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--brand)]/15 text-[var(--brand)] border border-[var(--brand)]/30 hover:bg-[var(--brand)]/25 cursor-pointer text-sm font-medium transition">
          <i className={`fa-solid ${uploading ? "fa-spinner fa-spin" : "fa-cloud-arrow-up"}`} />
          {uploading ? "Uploading…" : label}
          <input
            type="file"
            accept={accept}
            className="hidden"
            disabled={uploading}
            onChange={(e) => e.target.files?.[0] && handle(e.target.files[0])}
          />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-slate-400 hover:text-red-400"
          >
            <i className="fa-solid fa-xmark mr-1" />Remove
          </button>
        )}
      </div>
      {value && (
        <div className="rounded-lg overflow-hidden border border-white/10 bg-black/40 max-w-xs">
          {isVideo ? (
            <video src={value} controls className="w-full h-32 object-cover" />
          ) : (
            <img src={value} alt="" className="w-full h-32 object-cover" />
          )}
        </div>
      )}
      <input
        type="url"
        placeholder="Or paste an external URL"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#07101f] border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[var(--brand)]"
      />
    </div>
  );
}
