import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

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

  const handle = async (file: File) => {
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      toast.error("File too large (max 50MB)");
      return;
    }
    setUploading(true);
    try {
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
        className="w-full bg-[#0a1120] border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[var(--brand)]"
      />
    </div>
  );
}
