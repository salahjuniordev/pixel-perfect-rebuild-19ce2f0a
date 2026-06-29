const items = [
  "GitHub", "Git LFS", "Figma", "Canva", "Wix", "HTML5", "CSS3", "JavaScript",
  "React", "Node Js", "Photoshop", "Illustrator", "Word", "PowerPoint", "Excel",
];

export function ToolsMarquee() {
  const doubled = [...items, ...items];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="marquee-item">
            <span className="text-[--brand]">·</span>
            <span>{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
