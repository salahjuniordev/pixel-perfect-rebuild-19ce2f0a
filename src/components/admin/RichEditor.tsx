import { useEffect, useRef } from "react";

const tools: { cmd: string; icon: string; title: string; arg?: string }[] = [
  { cmd: "bold", icon: "fa-bold", title: "Bold" },
  { cmd: "italic", icon: "fa-italic", title: "Italic" },
  { cmd: "underline", icon: "fa-underline", title: "Underline" },
  { cmd: "formatBlock", arg: "h2", icon: "fa-heading", title: "Heading" },
  { cmd: "formatBlock", arg: "p", icon: "fa-paragraph", title: "Paragraph" },
  { cmd: "insertUnorderedList", icon: "fa-list-ul", title: "Bulleted list" },
  { cmd: "insertOrderedList", icon: "fa-list-ol", title: "Numbered list" },
  { cmd: "formatBlock", arg: "blockquote", icon: "fa-quote-right", title: "Quote" },
];

export function RichEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || "";
    }
  }, [value]);

  const exec = (cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg);
    ref.current?.focus();
    onChange(ref.current?.innerHTML ?? "");
  };

  const insertLink = () => {
    const url = window.prompt("Enter URL");
    if (url) exec("createLink", url);
  };

  const insertImage = () => {
    const url = window.prompt("Image URL");
    if (url) exec("insertImage", url);
  };

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden bg-[#0a1120]">
      <div className="flex flex-wrap gap-1 px-2 py-2 border-b border-white/10 bg-white/[0.02]">
        {tools.map((t, i) => (
          <button
            key={i}
            type="button"
            title={t.title}
            onClick={() => exec(t.cmd, t.arg)}
            className="h-8 w-8 grid place-items-center rounded text-slate-300 hover:bg-white/10 hover:text-[var(--brand)]"
          >
            <i className={`fa-solid ${t.icon} text-xs`} />
          </button>
        ))}
        <button type="button" title="Link" onClick={insertLink}
          className="h-8 w-8 grid place-items-center rounded text-slate-300 hover:bg-white/10 hover:text-[var(--brand)]">
          <i className="fa-solid fa-link text-xs" />
        </button>
        <button type="button" title="Image" onClick={insertImage}
          className="h-8 w-8 grid place-items-center rounded text-slate-300 hover:bg-white/10 hover:text-[var(--brand)]">
          <i className="fa-solid fa-image text-xs" />
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        className="min-h-[260px] max-h-[420px] overflow-y-auto px-4 py-3 text-sm text-white prose-editor focus:outline-none"
        style={{ lineHeight: 1.7 }}
      />
      <style>{`
        .prose-editor h2 { font-size: 1.4rem; font-weight: 700; margin: 1rem 0 0.5rem; color: #fff; }
        .prose-editor p { margin: 0.5rem 0; }
        .prose-editor ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        .prose-editor ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
        .prose-editor blockquote { border-left: 3px solid var(--brand); padding-left: 1rem; color: #cbd5e1; font-style: italic; margin: 0.75rem 0; }
        .prose-editor a { color: var(--brand); text-decoration: underline; }
        .prose-editor img { max-width: 100%; border-radius: 8px; margin: 0.75rem 0; }
      `}</style>
    </div>
  );
}
