import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { LanguageProvider } from "@/lib/language";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { BackToTop } from "@/components/site/BackToTop";
import type { ReactNode } from "react";

type Post = {
  slug: string; title: string; tag: string; date: string; read: string; img: string; alt: string; body: ReactNode;
};

const posts: Record<string, Post> = {
  "building-ai-marketing-saas-cosmetics-cameroon": {
    slug: "building-ai-marketing-saas-cosmetics-cameroon",
    title: "Building an AI Marketing SaaS for a Cosmetics Brand in Cameroon",
    tag: "AI & Tools", date: "January 5, 2026", read: "7 min read",
    img: "https://res.cloudinary.com/drmamswdc/image/upload/v1779906593/file_00000000b818720aafa06ee3cd5def66_xvmwwa.png",
    alt: "Building an AI Marketing SaaS for Maney Cosmetics – Salah Junior",
    body: (
      <>
        <p>Maney Cosmetics is a growing beauty brand based in Douala. Their problem: creating consistent marketing content across Instagram, WhatsApp Status, and print took hours every week. My job was to cut that time to minutes.</p>
        <h3>What the Product Does</h3>
        <p>The Maney AI Studio lets the brand team:</p>
        <ul>
          <li>Upload a product image and generate a professional marketing flyer in seconds using <strong>fal.ai</strong></li>
          <li>Get AI-written captions in French and English via <strong>Google Gemini</strong></li>
          <li>Chat with a brand-aware assistant that knows their tone and product line</li>
          <li>Export everything directly to WhatsApp or download for Instagram</li>
        </ul>
        <h3>The Stack</h3>
        <p>Next.js handles the frontend and API routes. fal.ai powers the image generation — it's fast, affordable, and the output quality is excellent for commercial product shots. Gemini 1.5 Flash handles the text. The whole thing runs on Vercel with a Cloudinary CDN for image storage.</p>
        <h3>What I Learned</h3>
        <p>AI products live or die by their prompts. I spent more time engineering the system prompts than I did building the UI. The brand's tone, product vocabulary, and visual style all had to be baked into every API call. That invisible work is what makes the output feel like it came from the brand — not a generic AI.</p>
      </>
    ),
  },
  "dark-mode-ui-african-saas": {
    slug: "dark-mode-ui-african-saas",
    title: "Dark Mode UI: Why African SaaS Products Should Embrace It",
    tag: "UI/UX Design", date: "February 14, 2026", read: "4 min read",
    img: "https://res.cloudinary.com/drmamswdc/image/upload/v1779906593/file_000000000dd471f494e7cd37eaac79a4_zt1xsn.png",
    alt: "Dark Mode UI Design for African SaaS Products",
    body: (
      <>
        <p>Walk into any office in Yaoundé at noon. The sun is brutal. Screens are at max brightness. Employees squint at spreadsheets, dashboards, and dashboards within dashboards. Dark mode isn't a trend here — it's a relief.</p>
        <h3>Why It Matters More in Africa</h3>
        <p>Three concrete reasons dark mode wins in the African SaaS context:</p>
        <ul>
          <li><strong>Harsh ambient light</strong> — high-contrast dark backgrounds are easier to read when you're competing with sunlight</li>
          <li><strong>OLED & battery life</strong> — most affordable Android phones use OLED displays; true black pixels draw zero power</li>
          <li><strong>Premium perception</strong> — users associate dark interfaces with quality. It's the same reason luxury cars have dark interiors</li>
        </ul>
        <h3>How to Do It Right</h3>
        <p>Don't just invert your light theme. Start from a base of <code>#0f172a</code> (deep navy, not pure black). Use <code>#1e293b</code> for cards and containers. Reserve pure white (<code>#ffffff</code>) for almost nothing — use <code>#e2e8f0</code> for primary text.</p>
        <p>Your accent color needs to pass WCAG AA on your darkest background. Test it. Don't guess.</p>
        <p>The result is a product that feels intentional, readable, and modern — without a single trend-chasing gradient.</p>
      </>
    ),
  },
  "how-i-build-full-stack-apps-for-african-clients": {
    slug: "how-i-build-full-stack-apps-for-african-clients",
    title: "How I Build Full-Stack Apps for African Clients",
    tag: "Web Development", date: "March 20, 2026", read: "5 min read",
    img: "https://res.cloudinary.com/drmamswdc/image/upload/v1779906618/file_000000006c9071f483845b7f26fe30a7_jimvds.png",
    alt: "How I Build Full-Stack Apps for African Clients – Salah Junior",
    body: (
      <>
        <p>Every client project starts the same way: a brief. But in Cameroon, that brief rarely comes as a clean PDF. It arrives over WhatsApp voice notes, across two languages, with shifting scope and an urgent deadline.</p>
        <h3>The First Conversation</h3>
        <p>I start every engagement with a clarity call. Not a sales call — a diagnostic. I need to know: What problem are we actually solving? Who is the user? What does success look like in 60 days? Most clients haven't thought past "I want a website." That's fine. My job is to help them think clearly before I write a single line of code.</p>
        <h3>My Tech Stack in 2026</h3>
        <p>For most client projects I reach for:</p>
        <ul>
          <li><strong>Next.js</strong> — server-side rendering, fast, SEO-ready out of the box</li>
          <li><strong>Tailwind CSS</strong> — utility-first, no fighting with stylesheets</li>
          <li><strong>Node.js + Express</strong> — simple REST APIs when a backend is needed</li>
          <li><strong>MongoDB Atlas</strong> — flexible schema, free tier works for most MVPs</li>
          <li><strong>Vercel</strong> — zero-config deploys, edge network, free for small projects</li>
        </ul>
        <h3>Staying Organized</h3>
        <p>I use a simple Notion board: Backlog → In Progress → Review → Done. Every task maps to a client-visible milestone. No surprises. No scope creep without a conversation.</p>
        <p>The result? Most projects ship in under three weeks. Clients get working software. I get referrals. That's the loop.</p>
      </>
    ),
  },
};

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = posts[params.slug];
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: `${loaderData.title} | Salah Junior` }] : [],
  }),
  component: BlogPostPage,
});

function BlogPostPage() {
  const post = Route.useLoaderData();
  return (
    <LanguageProvider>
      <Navbar />
      <article className="pt-32 pb-20">
        <div className="container-sj max-w-3xl">
          <Link to="/" hash="blog" className="text-sm text-[--brand] hover:underline mb-6 inline-flex items-center gap-2">
            <i className="fa-solid fa-arrow-left" /> Back to Blog
          </Link>
          <span className="inline-block text-xs text-[--brand] uppercase tracking-widest mb-3">{post.tag}</span>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">{post.title}</h1>
          <div className="text-xs text-slate-500 flex gap-4 mb-8">
            <span><i className="fa-regular fa-calendar mr-1" />{post.date}</span>
            <span><i className="fa-regular fa-clock mr-1" />{post.read}</span>
            <span>By Salah Junior</span>
          </div>
          <img src={post.img} alt={post.alt} className="w-full rounded-2xl mb-10" />
          <div className="prose-blog">
            {post.body}
          </div>
        </div>
      </article>
      <Footer />
      <BackToTop />
      <style>{`
        .prose-blog p { color: #cbd5e1; line-height: 1.8; margin-bottom: 1.25rem; }
        .prose-blog h3 { color: #fff; font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; }
        .prose-blog ul { color: #cbd5e1; padding-left: 1.5rem; margin-bottom: 1.25rem; list-style: disc; }
        .prose-blog li { margin-bottom: 0.5rem; }
        .prose-blog strong { color: #fff; }
        .prose-blog code { background: rgba(14,165,233,0.15); color: #38bdf8; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
      `}</style>
    </LanguageProvider>
  );
}
