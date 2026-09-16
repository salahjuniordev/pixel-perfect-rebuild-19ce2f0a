// Real software brand icons. Most load via simpleicons CDN; the four icons that
// were removed from Simple Icons (trademark takedowns) are self-hosted SVGs so
// they never break — see public/icons/.
const items: { name: string; slug: string; color: string; local?: boolean }[] = [
  { name: "HTML5", slug: "html5", color: "E34F26" },
  { name: "CSS3", slug: "css3", color: "1572B6", local: true },
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
  { name: "Canva", slug: "canva", color: "00C4CC", local: true },
  { name: "Adobe Photoshop", slug: "adobephotoshop", color: "31A8FF", local: true },
  { name: "Adobe Illustrator", slug: "adobeillustrator", color: "FF9A00", local: true },
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
              src={
                item.local
                  ? `/icons/${item.slug}.svg`
                  : `https://cdn.simpleicons.org/${item.slug}/${item.color}`
              }
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
