import { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/language";

const steps = [
  {
    icon: "fa-comments",
    en: "Discovery",
    fr: "Découverte",
    dEn: "A clarity call to understand your goal, users and definition of success.",
    dFr: "Un appel pour comprendre votre objectif, vos utilisateurs et vos critères de réussite.",
  },
  {
    icon: "fa-file-signature",
    en: "Proposal",
    fr: "Proposition",
    dEn: "A clear scope, timeline and fixed quote — no surprises, no scope creep.",
    dFr: "Un périmètre clair, un délai et un devis fixe — sans surprises.",
  },
  {
    icon: "fa-code",
    en: "Build",
    fr: "Construction",
    dEn: "Weekly demos with milestone check-ins so you see progress as it happens.",
    dFr: "Des démos hebdomadaires avec points d'étape pour suivre l'avancement.",
  },
  {
    icon: "fa-rocket",
    en: "Launch",
    fr: "Lancement",
    dEn: "Deployment, handoff of all files, and post-launch support included.",
    dFr: "Déploiement, remise de tous les fichiers et support après lancement inclus.",
  },
];

export function Process() {
  const { t, lang } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const timeline = timelineRef.current;
    const orb = orbRef.current;
    if (!section || !timeline) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rows = Array.from(timeline.querySelectorAll<HTMLElement>(".pt-row"));

    // Reveal rows as they enter the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.25 },
    );
    rows.forEach((r) => io.observe(r));

    if (reduced) {
      // Static: mark everything passed immediately, no scroll work.
      rows.forEach((r) => r.classList.add("is-in", "is-passed"));
      return () => io.disconnect();
    }

    // Scroll-driven progress: how far the timeline has been scrolled through.
    const onScroll = () => {
      const rect = timeline.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the timeline's top reaches the viewport bottom-ish (80% line),
      // 1 when its bottom reaches the viewport top-ish (30% line).
      const total = rect.height + vh * 0.5;
      const progress = Math.min(1, Math.max(0, (vh * 0.8 - rect.top) / total));
      timeline.style.setProperty("--pt-progress", String(progress));
      if (orb) orb.style.top = `${progress * 100}%`;

      // Light up nodes the orb has passed.
      const orbY = rect.top + progress * rect.height;
      for (const row of rows) {
        const node = row.querySelector<HTMLElement>(".pt-node");
        if (!node) continue;
        const ny = node.getBoundingClientRect().top + node.offsetHeight / 2;
        row.classList.toggle("is-passed", ny <= orbY + 4);
      }

      // Parallax: drift the glow blobs at a fraction of scroll speed.
      const glows = section.querySelectorAll<HTMLElement>(".pt-glow");
      const secRect = section.getBoundingClientRect();
      const drift = (secRect.top + secRect.height / 2 - vh / 2) * -0.06;
      glows.forEach((g, i) => {
        g.style.transform = `translateY(${drift * (i === 0 ? 1 : -1.4)}px)`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="process" ref={sectionRef} className="pt-section">
      <div className="pt-glow pt-glow-a" aria-hidden />
      <div className="pt-glow pt-glow-b" aria-hidden />
      <div className="container-sj">
        <div className="pt-head sec-head">
          <p className="eyebrow">{t("Process", "Processus")}</p>
          <h2>{t("How We'll Work Together", "Comment Nous Allons Travailler")}</h2>
          <div className="underline" />
        </div>

        <div className="pt-timeline" ref={timelineRef}>
          <div className="pt-rail" aria-hidden>
            <div className="pt-rail-fill" />
          </div>
          <div className="pt-orb" ref={orbRef} aria-hidden />

          {steps.map((s, i) => (
            <div key={s.en} className="pt-row">
              <div className="pt-card">
                <div className="pt-num">{String(i + 1).padStart(2, "0")}</div>
                <div className="pt-icon">
                  <i className={`fa-solid ${s.icon}`} />
                </div>
                <h3 className="pt-title">{t(s.en, s.fr)}</h3>
                <p className="pt-desc">{lang === "fr" ? s.dFr : s.dEn}</p>
              </div>
              <div className="pt-node" aria-hidden>
                <i className={`fa-solid ${s.icon}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
