// Real software brand icons via simpleicons CDN. Colors are official brand hex (no #).
const items: { name: string; slug: string; color: string }[] = [
  { name: "HTML5", slug: "html5", color: "E34F26" },
  { name: "CSS3", slug: "css3", color: "1572B6" },
  { name: "JavaScript", slug: "javascript", color: "F7DF1E" },
  { name: "TypeScript", slug: "typescript", color: "3178C6" },
  { name: "React", slug: "react", color: "61DAFB" },
  { name: "Node.js", slug: "nodedotjs", color: "5FA04E" },
  { name: "Tailwind CSS", slug: "tailwindcss", color: "06B6D4" },
  { name: "Vite", slug: "vite", color: "646CFF" },
  { name: "Supabase", slug: "supabase", color: "3ECF8E" },
  { name: "Vercel", slug: "vercel", color: "000000" },
  { name: "GitHub", slug: "github", color: "181717" },
  { name: "Git", slug: "git", color: "F05032" },
  { name: "Figma", slug: "figma", color: "F24E1E" },
  { name: "Canva", slug: "canva", color: "00C4CC" },
  { name: "Adobe Photoshop", slug: "adobephotoshop", color: "31A8FF" },
  { name: "Adobe Illustrator", slug: "adobeillustrator", color: "FF9A00" },
  { name: "WordPress", slug: "wordpress", color: "21759B" },
  { name: "Wix", slug: "wix", color: "0C6EFC" },
];

export function ToolsMarquee() {
  const doubled = [...items, ...items];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="marquee-item" title={item.name} aria-label={item.name}>
            <img
              src={`https://cdn.simpleicons.org/${item.slug}/${item.color}`}
              alt={item.name}
              loading="lazy"
              width={44}
              height={44}
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
