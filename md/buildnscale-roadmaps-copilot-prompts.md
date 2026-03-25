# 🚀 BuildnScale — Roadmaps Page: Complete GitHub Copilot Prompt Pack
### Prepared by: Your Growth & Development Partner
### Site: `buildnscale.dev` | Stack: Next.js 15 App Router + MDX + Tailwind

---

> **How to use this pack:**
> Open each section in GitHub Copilot Chat (`Ctrl+Shift+I` in VS Code) or paste into Copilot Edits.
> Run them **in order**. Each prompt builds on the previous one.
> Sections marked 🔴 are required. Sections marked 🟡 are high-impact enhancements.

---

## 📁 FINAL FILE STRUCTURE YOU'RE BUILDING

```
src/
├── app/
│   └── roadmaps/
│       ├── page.tsx                          ← Roadmaps index (listing page)
│       ├── layout.tsx                        ← Shared layout for all roadmap pages
│       └── [slug]/
│           └── page.tsx                      ← Dynamic individual roadmap page
│
├── content/
│   └── roadmaps/
│       └── ai-engineer.mdx                   ← Full AI Engineer roadmap content
│
├── lib/
│   └── roadmaps.ts                           ← MDX loader + metadata parser
│
└── components/
    └── roadmaps/
        ├── RoadmapCard.tsx                   ← Card on the index listing page
        ├── RoadmapHero.tsx                   ← Hero section for individual roadmap
        ├── RoadmapPhase.tsx                  ← One phase/module block
        ├── RoadmapSidebar.tsx                ← Sticky progress + jump links sidebar
        ├── RoadmapProgress.tsx               ← LocalStorage-based progress tracker
        ├── SkillBadge.tsx                    ← Coloured skill/tool tag pill
        └── RoadmapSEO.tsx                    ← JSON-LD structured data injector
```

---

---

# 🔴 PROMPT 1 — MDX Infrastructure & Content Loader

**Paste this into Copilot Chat. Run first.**

```
I'm building a Next.js 15 App Router blog at buildnscale.dev.
I need to set up MDX-based roadmap content loading.

Create the file `src/lib/roadmaps.ts` that does the following:

1. Reads all `.mdx` files from `src/content/roadmaps/`
2. Parses frontmatter using `gray-matter`
3. Returns typed metadata. The frontmatter schema for a roadmap MDX file is:

```ts
export type RoadmapMeta = {
  slug: string           // derived from filename, e.g. "ai-engineer"
  title: string          // e.g. "AI Engineer Roadmap 2026"
  headline: string       // Short punchy subheading shown in cards
  description: string    // 2-3 sentence SEO meta description
  category: string       // e.g. "AI & Machine Learning"
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: string       // e.g. "6–8 months"
  modules: number        // total number of phases/modules
  lastUpdated: string    // ISO date string "2026-03-01"
  tags: string[]         // e.g. ["Python", "LangChain", "LLMs", "MLOps"]
  badge: string          // emoji badge e.g. "🤖"
  featured: boolean
  status: "published" | "draft"
  ogImage: string        // relative path or unsplash URL
  prerequisites: string[] // e.g. ["Basic Python", "Git fundamentals"]
  outcomes: string[]     // 4-6 bullet outcomes learners get
}
```

4. Export these functions:
   - `getAllRoadmaps(): Promise<RoadmapMeta[]>` — returns all published roadmaps sorted by featured first
   - `getRoadmapBySlug(slug: string): Promise<{ meta: RoadmapMeta; content: string } | null>`
   - `getRoadmapSlugs(): Promise<string[]>` — for generateStaticParams

Use `fs` and `path` from Node.js. Do not use any CMS. Use gray-matter for frontmatter parsing.
Add proper error handling for missing files.
```

---

---

# 🔴 PROMPT 2 — AI Engineer MDX Content File

**Paste this into Copilot Chat. This creates your first real roadmap content.**

```
Create the file `src/content/roadmaps/ai-engineer.mdx`.

This is the full AI Engineer Roadmap for buildnscale.dev — a blog by M. Yousuf,
a Full-Stack Developer learning ML, DL & Agentic AI, writing from real production experience.

The tone is: practical, no-fluff, real-world focused. Written for developers who want to
transition into or level up in AI engineering in 2026.

---

START the file with this frontmatter exactly:

```yaml
---
title: "AI Engineer Roadmap 2026"
headline: "From developer to AI engineer — a production-focused path"
description: "A step-by-step AI Engineer roadmap for 2026. Learn Python, Machine Learning, Deep Learning, LLMs, LangChain, RAG, MLOps, and Agentic AI — built from real production experience."
category: "AI & Machine Learning"
difficulty: "Intermediate"
duration: "6–8 months"
modules: 8
lastUpdated: "2026-03-01"
tags: ["Python", "Machine Learning", "Deep Learning", "LLMs", "LangChain", "RAG", "MLOps", "Agentic AI", "FastAPI", "Vector Databases"]
badge: "🤖"
featured: true
status: "published"
ogImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80"
prerequisites:
  - "Comfortable with any programming language (Python preferred)"
  - "Basic understanding of web APIs"
  - "Git and command line basics"
outcomes:
  - "Build and deploy production RAG pipelines from scratch"
  - "Fine-tune and prompt-engineer LLMs for real use cases"
  - "Design and orchestrate multi-agent AI systems"
  - "Deploy ML models to production with monitoring and versioning"
  - "Integrate vector databases like Pinecone and Chroma into apps"
  - "Build AI-powered APIs with FastAPI that handle real traffic"
---
```

---

Then write the full MDX body with these 8 phases. Each phase should have:
- A `## Phase N — [Title]` heading
- An estimated time (e.g. *3–4 weeks*)
- A `### What You'll Learn` section with 5–8 bullet points of specific skills/concepts
- A `### Core Resources` section with 3–5 curated free learning resources (real, existing ones like fast.ai, Andrej Karpathy's lectures, official docs, etc.)
- A `### Milestone Project` section — one real, portfolio-worthy project they build at the end of the phase
- A `### Key Tools & Libraries` section listing the tools covered

Here are the 8 phases:

**Phase 1 — Python for AI**
Focus: NumPy, Pandas, Matplotlib, Seaborn, Jupyter, virtual environments, OOP for ML

**Phase 2 — Mathematics for Machine Learning**
Focus: Linear algebra (vectors, matrices), calculus (gradients, chain rule), probability & statistics, why these matter in practice (not just theory)

**Phase 3 — Classical Machine Learning**
Focus: scikit-learn, supervised learning (regression, classification), unsupervised (clustering, PCA), model evaluation, cross-validation, feature engineering

**Phase 4 — Deep Learning**
Focus: Neural network fundamentals, PyTorch (not TensorFlow), CNNs, RNNs, transformers architecture, training loops, GPU acceleration

**Phase 5 — Large Language Models & Prompt Engineering**
Focus: How LLMs work (tokenisation, attention, RLHF), OpenAI/Anthropic APIs, prompt engineering patterns, structured outputs, function calling, cost optimisation

**Phase 6 — RAG & Vector Databases**
Focus: RAG architecture, LangChain, LlamaIndex, Pinecone, Chroma, chunking strategies, embedding models, hybrid search, evaluation with RAGAS

**Phase 7 — Agentic AI & Multi-Agent Systems**
Focus: ReAct agents, tool use, LangGraph, CrewAI, memory systems, guardrails, multi-agent orchestration, real-world agentic app patterns

**Phase 8 — MLOps & Production Deployment**
Focus: FastAPI for ML serving, Docker containerisation, model versioning (MLflow), monitoring (Prometheus/Grafana basics), CI/CD for ML pipelines, cloud deployment (AWS/GCP basics)

---

Make the writing voice confident and practical. Add callout notes where relevant using MDX-compatible blockquote syntax. Reference real tools and real tradeoffs. This should read like advice from a senior engineer, not a Wikipedia article.
```

---

---

# 🔴 PROMPT 3 — Individual Roadmap Page (`[slug]/page.tsx`)

**This creates the dynamic route that renders each MDX roadmap.**

```
Create the file `src/app/roadmaps/[slug]/page.tsx` for buildnscale.dev.

This is a Next.js 15 App Router dynamic page that renders an individual roadmap from MDX.

Requirements:

1. **generateStaticParams** — call `getRoadmapSlugs()` from `@/lib/roadmaps`

2. **generateMetadata** — return full SEO metadata:
   - title: `${meta.title} | BuildnScale`
   - description: from meta.description
   - keywords: from meta.tags
   - openGraph with title, description, type: "article", publishedTime: meta.lastUpdated, tags
   - twitter card: "summary_large_image"
   - canonical URL: `https://buildnscale.dev/roadmaps/${slug}`

3. **JSON-LD Structured Data** — inject a `<script type="application/ld+json">` in the page head with:
   - @type: "LearningResource"
   - name: meta.title
   - description: meta.description
   - educationalLevel: meta.difficulty
   - timeRequired: meta.duration (converted to ISO 8601 duration format)
   - teaches: meta.tags (array)
   - author: { "@type": "Person", "name": "M. Yousuf", "url": "https://buildnscale.dev/author" }
   - publisher: { "@type": "Organization", "name": "BuildnScale", "url": "https://buildnscale.dev" }
   - dateModified: meta.lastUpdated

4. **Page Layout** — two-column on desktop (sidebar + main content), single column on mobile:
   - Left: sticky sidebar with:
     - Roadmap meta stats (difficulty badge, duration, modules count, last updated)
     - "Jump to phase" links (auto-generated from ## headings in the MDX)
     - Prerequisites list
     - "What You'll Learn" outcomes checklist (visual checkboxes, no JS required)
     - A CTA box: "Found this helpful? Share it" with Twitter and LinkedIn share links
   - Right: MDX rendered content with a custom MDX components map

5. **MDX Components Map** — pass custom components to the MDX renderer:
   - `h2`: styled phase header with a phase number pill and a top border
   - `h3`: styled section subheading
   - `ul` / `li`: custom styled lists
   - `blockquote`: styled callout box with a left accent border and subtle background
   - `code` (inline): styled inline code pill
   - `pre`: code block with copy button and language label
   - `a`: styled link that opens external links in new tab with rel="noopener noreferrer"

6. **Progress Tracker** — at the top of the page content, add a `<RoadmapProgress slug={slug} totalPhases={meta.modules} />` component (we will create this separately; just import and use it here)

7. **Breadcrumb** — add semantic breadcrumb nav: Home > Roadmaps > [Roadmap Title]
   Also inject BreadcrumbList JSON-LD for this.

8. Use `next-mdx-remote` or the built-in Next.js MDX support (whichever is already in the project).
   If neither is set up, use `next-mdx-remote/rsc` — add the install command in a comment.

Use Tailwind CSS for all styling. Match the existing site's dark/light mode if it uses next-themes.
The page must be a React Server Component (no "use client" at the top level).
```

---

---

# 🔴 PROMPT 4 — Roadmaps Index Page (`roadmaps/page.tsx`)

**This replaces the current dummy listing page.**

```
Rewrite `src/app/roadmaps/page.tsx` for buildnscale.dev.

This is the main /roadmaps listing page. It should be a Next.js 15 RSC (no "use client").

Requirements:

1. **SEO Metadata via generateMetadata:**
   - title: "Developer Roadmaps 2026 | BuildnScale"
   - description: "Free, opinionated learning roadmaps for developers. Structured paths for AI Engineering, Full-Stack Development, and DevOps — built from real production experience."
   - openGraph type: "website"
   - canonical: "https://buildnscale.dev/roadmaps"

2. **JSON-LD** — inject a CollectionPage schema:
   ```json
   {
     "@context": "https://schema.org",
     "@type": "CollectionPage",
     "name": "Developer Roadmaps 2026",
     "description": "...",
     "url": "https://buildnscale.dev/roadmaps",
     "author": { "@type": "Person", "name": "M. Yousuf" }
   }
   ```

3. **Hero Section:**
   - H1: "Developer Roadmaps"
   - Subheading: "Structured, opinionated learning paths built from real production experience — not recycled tutorials."
   - Three stat pills: total roadmaps count | "Updated 2026" | "100% Free"
   - A subtle animated gradient background or a clean minimal hero (Tailwind only, no JS)

4. **Filter Bar (client component):**
   - Extract this into a `<RoadmapFilterBar />` "use client" component
   - Filter tabs: "All" | "AI & ML" | "Full-Stack" | "DevOps & Cloud"
   - When a tab is selected, filter the roadmap cards shown below
   - Use URL search params (`?category=ai`) so filters are shareable and indexable
   - Animate card filter with a simple CSS transition (no framer-motion dependency)

5. **Roadmap Cards Grid:**
   - Render a `<RoadmapCard />` for each published roadmap from `getAllRoadmaps()`
   - Cards should show: badge emoji, title, headline, difficulty badge (colour-coded), duration, module count, tags (first 4), and a "Start Roadmap →" CTA button
   - Featured roadmap gets a larger "hero card" treatment at the top

6. **"Coming Soon" Section:**
   - Below the published roadmaps, add a muted section: "More Roadmaps Coming Soon"
   - Show placeholder cards for: "Full-Stack Developer" and "DevOps & Cloud" with a "Notify Me" button (links to newsletter)

7. **Bottom CTA:**
   - "Have a roadmap topic you want covered? Suggest one →" linking to a mailto or GitHub discussions

Use Tailwind. No external UI libraries. Match existing site dark/light mode.
```

---

---

# 🔴 PROMPT 5 — RoadmapProgress Component (LocalStorage Tracker)

**The most engagement-driving feature on the page.**

```
Create `src/components/roadmaps/RoadmapProgress.tsx`.

This is a "use client" component that renders a visual progress tracker for a roadmap.

Props:
  - slug: string         (roadmap identifier, used as localStorage key)
  - totalPhases: number  (total number of phases/modules)

Behaviour:
1. On mount, read progress from localStorage key `roadmap_progress_${slug}`.
   Data shape: `{ completedPhases: number[] }` — array of completed phase indices (1-based).

2. Render a horizontal progress bar showing X of N phases completed.
   Below the bar, show: "3 of 8 phases completed · 37%"

3. Render a row of phase indicator dots/circles (1 per phase):
   - Completed phases: filled green circle with a ✓ checkmark
   - Current phase (first incomplete): pulsing blue ring
   - Future phases: empty grey circle

4. Each dot is clickable — clicking a phase dot toggles it as complete/incomplete.
   Clicking a completed phase un-marks it (allows re-doing).

5. "Reset Progress" small text link at the end — clears localStorage for this roadmap.

6. Add a subtle animated celebration (CSS confetti burst or a simple scale+opacity animation)
   when all phases are marked complete.

7. Persist all changes immediately to localStorage.

8. The component must hydrate gracefully — use `useEffect` for localStorage reads to avoid
   SSR/hydration mismatch. Show a skeleton loader while hydrating.

Style with Tailwind. Support dark/light mode. Keep the component under 150 lines.
```

---

---

# 🟡 PROMPT 6 — RoadmapCard Component

```
Create `src/components/roadmaps/RoadmapCard.tsx`.

Props: `{ roadmap: RoadmapMeta; featured?: boolean }`

Two visual variants:
1. **Standard card** (featured=false):
   - White/dark card with subtle border and hover shadow
   - Badge emoji in a coloured circle top-left
   - Title (bold), headline (muted), difficulty badge (colour: green=Beginner, yellow=Intermediate, red=Advanced)
   - Row of stats: duration pill, module count pill
   - Tags: first 4 tags as small pills
   - "Start Roadmap →" button (full width, primary colour)
   - Link wraps the entire card to `/roadmaps/${slug}`

2. **Featured hero card** (featured=true):
   - Spans full width or 2 columns
   - Larger typography, gradient left border accent
   - Shows prerequisites and first 3 outcomes
   - "Most Popular" or relevant badge top-right
   - Two buttons: "Start Learning" (primary) + "View Curriculum" (outline)

Use Tailwind. No inline styles. Support dark mode. Make it fully accessible (aria-labels, semantic HTML).
```

---

---

# 🟡 PROMPT 7 — SEO: Sitemap & Robots Updates

```
Update or create `src/app/sitemap.ts` for buildnscale.dev.

Add roadmap URLs to the sitemap:
1. Import `getRoadmapSlugs` from `@/lib/roadmaps`
2. Add `/roadmaps` as a URL entry with:
   - changeFrequency: "monthly"
   - priority: 0.9
3. For each roadmap slug, add `/roadmaps/${slug}` with:
   - changeFrequency: "monthly"  
   - priority: 0.85
4. Keep existing blog post sitemap entries intact.

Also update or create `src/app/robots.ts`:
- Allow all crawlers on /roadmaps and /roadmaps/*
- Reference the sitemap URL: https://buildnscale.dev/sitemap.xml
```

---

---

# 🟡 PROMPT 8 — Roadmap Layout with Breadcrumb

```
Create `src/app/roadmaps/layout.tsx`.

This shared layout wraps all roadmap pages (both the index and individual pages).

Requirements:
1. A subtle top banner (dismissible via localStorage) that reads:
   "🎉 AI Engineer Roadmap 2026 is live — updated for the latest tools and frameworks."
   with an X button to dismiss. This is a "use client" component extracted as `<RoadmapBanner />`.

2. The layout renders `{children}` with consistent max-width container (matching rest of site).

3. A "Back to all roadmaps" link visible on individual roadmap pages (detect via pathname using usePathname).

Keep it minimal — the layout should add structure, not compete with page content.
```

---

---

# 🟡 PROMPT 9 — Internal Linking: Blog ↔ Roadmap Integration

```
I want to create deeper internal linking between my blog posts and roadmaps on buildnscale.dev.

1. In the individual roadmap page (`/roadmaps/[slug]/page.tsx`), add a section at the bottom:
   **"Related Articles from the Blog"**
   - Query blog posts that share tags with the roadmap's `meta.tags`
   - Show up to 4 related posts as compact cards (title, read time, tags)
   - This should use the existing `getAllPosts()` or similar function already in the codebase

2. In each blog post layout (wherever RelatedPosts or sidebar renders),
   add a **"Learning Roadmap"** sidebar widget that:
   - Detects if the current post's tags match any roadmap's tags
   - If yes, shows a small CTA card: "Building with LangChain? See the full AI Engineer Roadmap →"
   - Links to the relevant `/roadmaps/[slug]` page
   - Styled as a subtle highlighted card, not an ad

This creates a content loop: blog readers discover roadmaps, roadmap readers find deep-dive posts.
```

---

---

# ✅ FINAL CHECKLIST — Before Pushing to Production

Run through this after all prompts are implemented:

### Content Quality
- [ ] All 8 phases in `ai-engineer.mdx` have real, accurate content (not placeholder)
- [ ] Prerequisites and outcomes are honest and specific
- [ ] All resource links in MDX are real and working
- [ ] Milestone projects are actually buildable by the reader

### SEO
- [ ] `/roadmaps` page has unique title + meta description
- [ ] `/roadmaps/ai-engineer` has unique title + meta description
- [ ] JSON-LD `LearningResource` schema is present and valid (test at schema.org/validator)
- [ ] BreadcrumbList JSON-LD is present on individual roadmap pages
- [ ] Sitemap includes all roadmap URLs
- [ ] Canonical URLs are set correctly
- [ ] OG image is set (renders well when shared on Twitter/LinkedIn)

### Performance
- [ ] Page is statically generated (no dynamic server rendering unless needed)
- [ ] Images use `next/image`
- [ ] No layout shift from LocalStorage-based progress component (SSR skeleton)
- [ ] Tailwind purge is working (no unused CSS in production build)

### Accessibility
- [ ] All interactive elements have aria-labels
- [ ] Breadcrumb uses `<nav aria-label="Breadcrumb">`
- [ ] Progress tracker is keyboard navigable
- [ ] Color contrast passes WCAG AA

### Internal Linking
- [ ] Blog posts with AI/LangChain tags show roadmap CTA in sidebar
- [ ] Roadmap pages show related blog posts at the bottom
- [ ] "Coming Soon" cards link to newsletter subscribe

---

---

# 📌 CONTENT STRATEGY NOTE (for M. Yousuf)

Once the AI Engineer roadmap is live, here's the growth sequence:

**Month 1–2:** AI Engineer Roadmap live → write 2–3 deep-dive posts that map directly to roadmap phases (e.g. "Phase 6: RAG Deep Dive" already exists as your LangChain post — link them!)

**Month 3:** Publish Full-Stack Developer roadmap using the same MDX infrastructure. Content already half-exists in your existing posts.

**Month 4:** Add DevOps & Cloud roadmap. By now you have 3 roadmaps indexed by Google as LearningResource structured data — this is a significant SEO moat.

**Long-term:** Each roadmap becomes an evergreen traffic source. People bookmark roadmaps and return. Internal links from roadmaps to blog posts boost post rankings. Newsletter signups grow from the "Notify Me" and progress-completion CTAs.

---

*Prompt pack prepared for buildnscale.dev — Next.js 15 App Router + MDX + Tailwind*
*Run all 🔴 prompts first, then 🟡 prompts in any order.*
