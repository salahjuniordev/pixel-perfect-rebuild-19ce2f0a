UPDATE public.blog_posts SET body='<p>Maney Cosmetics is a growing beauty brand based in Douala. Their problem: creating consistent marketing content across Instagram, WhatsApp Status, and print took hours every week. My job was to cut that time to minutes.</p>
<h3>What the Product Does</h3>
<p>The Maney AI Studio lets the brand team:</p>
<ul>
<li>Upload a product image and generate a professional marketing flyer in seconds using <strong>fal.ai</strong></li>
<li>Get AI-written captions in French and English via <strong>Google Gemini</strong></li>
<li>Chat with a brand-aware assistant that knows their tone and product line</li>
<li>Export everything directly to WhatsApp or download for Instagram</li>
</ul>
<h3>The Stack</h3>
<p>Next.js handles the frontend and API routes. fal.ai powers the image generation — it''s fast, affordable, and the output quality is excellent for commercial product shots. Gemini 1.5 Flash handles the text. The whole thing runs on Vercel with a Cloudinary CDN for image storage.</p>
<h3>What I Learned</h3>
<p>AI products live or die by their prompts. I spent more time engineering the system prompts than I did building the UI. The brand''s tone, product vocabulary, and visual style all had to be baked into every API call. That invisible work is what makes the output feel like it came from the brand — not a generic AI.</p>' WHERE slug='building-ai-marketing-saas-cosmetics-cameroon';

UPDATE public.blog_posts SET body='<p>Walk into any office in Yaoundé at noon. The sun is brutal. Screens are at max brightness. Employees squint at spreadsheets, dashboards, and dashboards within dashboards. Dark mode isn''t a trend here — it''s a relief.</p>
<h3>Why It Matters More in Africa</h3>
<p>Three concrete reasons dark mode wins in the African SaaS context:</p>
<ul>
<li><strong>Harsh ambient light</strong> — high-contrast dark backgrounds are easier to read when you''re competing with sunlight</li>
<li><strong>OLED &amp; battery life</strong> — most affordable Android phones use OLED displays; true black pixels draw zero power</li>
<li><strong>Premium perception</strong> — users associate dark interfaces with quality. It''s the same reason luxury cars have dark interiors</li>
</ul>
<h3>How to Do It Right</h3>
<p>Don''t just invert your light theme. Start from a base of <code>#0f172a</code> (deep navy, not pure black). Use <code>#1e293b</code> for cards and containers. Reserve pure white (<code>#ffffff</code>) for almost nothing — use <code>#e2e8f0</code> for primary text.</p>
<p>Your accent color needs to pass WCAG AA on your darkest background. Test it. Don''t guess.</p>
<p>The result is a product that feels intentional, readable, and modern — without a single trend-chasing gradient.</p>' WHERE slug='dark-mode-ui-african-saas';

UPDATE public.blog_posts SET body='<p>Every client project starts the same way: a brief. But in Cameroon, that brief rarely comes as a clean PDF. It arrives over WhatsApp voice notes, across two languages, with shifting scope and an urgent deadline.</p>
<h3>The First Conversation</h3>
<p>I start every engagement with a clarity call. Not a sales call — a diagnostic. I need to know: What problem are we actually solving? Who is the user? What does success look like in 60 days? Most clients haven''t thought past "I want a website." That''s fine. My job is to help them think clearly before I write a single line of code.</p>
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
<p>The result? Most projects ship in under three weeks. Clients get working software. I get referrals. That''s the loop.</p>' WHERE slug='how-i-build-full-stack-apps-for-african-clients';