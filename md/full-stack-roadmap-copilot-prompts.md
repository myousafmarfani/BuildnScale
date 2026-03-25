# 🚀 BuildnScale — Full-Stack Developer Roadmap: Complete GitHub Copilot Prompt Pack
### Site: `buildnscale.dev` | Stack: Next.js 15 App Router + MDX + Tailwind
### Standalone — runs independently. No prior pack required.

---

> **How to use this pack:**
> Open each section in GitHub Copilot Chat (`Ctrl+Shift+I` in VS Code) or paste into Copilot Edits.
> Run them **in order**. Sections marked 🔴 are required. Sections marked 🟡 are high-impact enhancements.
> If you already ran the AI Engineer prompt pack, check each prompt's SKIP NOTE before running.

---

## 📁 COMPLETE FILE STRUCTURE THIS PACK BUILDS

```
src/
├── app/
│   └── roadmaps/
│       ├── page.tsx                          ← Roadmaps index (listing all roadmaps)
│       ├── layout.tsx                        ← Shared layout: banner + back-link + container
│       └── [slug]/
│           └── page.tsx                      ← Dynamic individual roadmap page (RSC)
│
├── content/
│   └── roadmaps/
│       ├── ai-engineer.mdx                   ← (already exists from AI Engineer pack)
│       └── full-stack-developer.mdx          ← YOU PLACE THIS FILE MANUALLY
│
├── lib/
│   └── roadmaps.ts                           ← MDX loader + metadata parser (with relatedPosts)
│
└── components/
    └── roadmaps/
        ├── RoadmapCard.tsx                   ← Card component (index listing page)
        ├── RoadmapHero.tsx                   ← Hero section (individual roadmap page)
        ├── RoadmapSidebar.tsx                ← Sticky sidebar: stats + jump links + outcomes
        ├── RoadmapProgress.tsx               ← LocalStorage-based phase progress tracker
        ├── RoadmapBanner.tsx                 ← Dismissible top announcement banner
        ├── RoadmapFilterBar.tsx              ← Category filter tabs (index page)
        ├── RoadmapCTA.tsx                    ← Blog sidebar widget linking to roadmaps
        ├── ActivePhaseHighlight.tsx          ← Client component: active scroll detection
        └── SkillBadge.tsx                    ← Coloured skill/tool tag pill
```

---

## ⚡ PARITY CONTRACT

Every individual roadmap page — whether AI Engineer or Full-Stack Developer or any future
roadmap — must be **structurally identical**. Same layout, same sidebar sections in the same
order, same MDX component styling, same progress tracker behaviour, same SEO schema shape,
same breadcrumb, same "From the Blog" section, same share CTAs.

Only the content (phases, tools, resources) and frontmatter values differ.
This pack enforces that contract for the Full-Stack Developer roadmap.

---

---

# 🔴 PROMPT 1 — MDX Infrastructure & Content Loader (with `relatedPosts`)

> **SKIP NOTE:** Skip if `src/lib/roadmaps.ts` already exists AND already contains
> the optional `relatedPosts?: string[]` field on `RoadmapMeta`.
> **RUN IF:** The file doesn't exist, or it exists but is missing `relatedPosts`.

```
I'm working on a Next.js 15 App Router blog at buildnscale.dev.
Create or update the file `src/lib/roadmaps.ts`.

1. Reads all `.mdx` files from `src/content/roadmaps/`
2. Parses frontmatter using `gray-matter`
3. Uses this exact RoadmapMeta type:

```ts
export type RoadmapMeta = {
  slug: string              // derived from filename e.g. "full-stack-developer"
  title: string             // e.g. "Full-Stack Web Developer Roadmap 2026"
  headline: string          // short punchy subheading for cards
  description: string       // 2-3 sentence SEO meta description
  category: string          // e.g. "Full-Stack Development"
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: string          // e.g. "8-12 months"
  modules: number           // total phases count
  lastUpdated: string       // ISO date string e.g. "2026-03-25"
  tags: string[]            // e.g. ["HTML", "CSS", "JavaScript", "TypeScript"]
  badge: string             // emoji e.g. "🚀"
  featured: boolean
  status: "published" | "draft"
  ogImage: string           // Unsplash URL or relative path
  prerequisites: string[]   // what readers need before starting
  outcomes: string[]        // 4-8 what-you'll-be-able-to-do statements
  relatedPosts?: string[]   // optional: blog post slugs for "From the Blog" section
}
```

4. Export these four functions:
   - `getAllRoadmaps(): Promise<RoadmapMeta[]>`
     Returns all published roadmaps, sorted: featured first, then by lastUpdated descending.
   - `getRoadmapBySlug(slug: string): Promise<{ meta: RoadmapMeta; content: string } | null>`
     Returns raw MDX string as `content`. Returns null if not found — does not throw.
   - `getRoadmapSlugs(): Promise<string[]>`
     Returns slugs of all published roadmaps. Used by generateStaticParams.
   - `getRoadmapsByCategory(category: string): Promise<RoadmapMeta[]>`
     Returns published roadmaps matching the category field (case-insensitive).

5. Error handling:
   - Missing directory: return [] with a console.warn
   - Malformed frontmatter: skip that file, log filename in a console.warn
   - Missing required fields: skip that file, log which fields are absent

Use Node.js `fs` and `path`. Use `gray-matter`. No CMS, no external fetch.
```

---

---

# 🔴 PROMPT 2 — Place the MDX Content File (Manual Step)

> **This is a file placement step, not a Copilot prompt.**

**Action:** Copy `full-stack-developer.mdx` into your project:

```
src/content/roadmaps/full-stack-developer.mdx
```

Verify detection after placing the file:

```bash
npm run dev
# Visit: http://localhost:3000/roadmaps/full-stack-developer
```

If the page 404s, continue with Prompt 3 first — the dynamic route may not exist yet.

---

---

# 🔴 PROMPT 3 — Individual Roadmap Page (`[slug]/page.tsx`)

> **SKIP NOTE:** Skip if `src/app/roadmaps/[slug]/page.tsx` already exists with ALL of:
> generateStaticParams, generateMetadata (full OG + twitter + canonical), LearningResource
> JSON-LD, BreadcrumbList JSON-LD, two-column sidebar layout, RoadmapHero, RoadmapProgress,
> custom MDX components map, and "From the Blog" section.
> **RUN IF:** The file is missing any of the above — run the full prompt to ensure parity.

```
Create or fully rewrite `src/app/roadmaps/[slug]/page.tsx` for buildnscale.dev.

This page must render EVERY roadmap identically — ai-engineer, full-stack-developer,
and any future slug in src/content/roadmaps/. The structure never changes between roadmaps.

═══════════════════════════════════════
PART A — STATIC GENERATION
═══════════════════════════════════════

Export generateStaticParams:
  - Call getRoadmapSlugs() from @/lib/roadmaps
  - Return [{ slug }] objects
  - Set: export const dynamicParams = false

═══════════════════════════════════════
PART B — SEO METADATA (generateMetadata)
═══════════════════════════════════════

If slug not found: return { title: "Roadmap Not Found | BuildnScale" }

Otherwise return:
  title: `${meta.title} | BuildnScale`
  description: meta.description
  keywords: meta.tags.join(", ")
  openGraph:
    title: meta.title
    description: meta.description
    type: "article"
    publishedTime: meta.lastUpdated
    tags: meta.tags
    images: [{ url: meta.ogImage, width: 1200, height: 630, alt: meta.title }]
    url: `https://buildnscale.dev/roadmaps/${slug}`
  twitter:
    card: "summary_large_image"
    title: meta.title
    description: meta.description
    images: [meta.ogImage]
  alternates:
    canonical: `https://buildnscale.dev/roadmaps/${slug}`

═══════════════════════════════════════
PART C — JSON-LD STRUCTURED DATA
═══════════════════════════════════════

Inject two JSON-LD scripts in the page using Next.js script tag or dangerouslySetInnerHTML:

Script 1 — LearningResource:
{
  "@context": "https://schema.org",
  "@type": "LearningResource",
  "name": meta.title,
  "description": meta.description,
  "url": `https://buildnscale.dev/roadmaps/${slug}`,
  "educationalLevel": meta.difficulty,
  "timeRequired": "(convert meta.duration string to ISO 8601 best approximation)",
  "teaches": meta.tags,
  "inLanguage": "en",
  "isAccessibleForFree": true,
  "dateModified": meta.lastUpdated,
  "author": {
    "@type": "Person",
    "name": "M. Yousuf",
    "url": "https://buildnscale.dev/author"
  },
  "publisher": {
    "@type": "Organization",
    "name": "BuildnScale",
    "url": "https://buildnscale.dev"
  },
  "image": meta.ogImage
}

Script 2 — BreadcrumbList:
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://buildnscale.dev" },
    { "@type": "ListItem", "position": 2, "name": "Roadmaps", "item": "https://buildnscale.dev/roadmaps" },
    { "@type": "ListItem", "position": 3, "name": meta.title, "item": `https://buildnscale.dev/roadmaps/${slug}` }
  ]
}

═══════════════════════════════════════
PART D — PAGE LAYOUT
═══════════════════════════════════════

Two-column grid on desktop, single column on mobile:
  className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 py-8"

LEFT COLUMN — Sticky Sidebar:
  position: sticky top-6 self-start
  Render: <RoadmapSidebar meta={meta} slug={slug} />
  (component spec in Prompt 9 — import it here)

RIGHT COLUMN — Main content:
  In this exact order:
  1. Breadcrumb nav:
       <nav aria-label="Breadcrumb">
         <ol> with three <li> items: Home → Roadmaps → [meta.title]
         Last item has aria-current="page" and is NOT a link
       </nav>
  2. <RoadmapHero meta={meta} />       (component spec in Prompt 8)
  3. <RoadmapProgress slug={slug} totalPhases={meta.modules} />  (component spec in Prompt 5)
  4. MDX rendered content              (spec in Part E below)
  5. "From the Blog" section           (spec in Prompt 4)

═══════════════════════════════════════
PART E — MDX RENDERING & COMPONENTS MAP
═══════════════════════════════════════

Use `next-mdx-remote/rsc` to compile and render the raw MDX string.
If not installed: // npm install next-mdx-remote

Pass this components map to MDXRemote:

  h2 → PhaseHeading component:
    - Extract phase number from heading text ("Phase 3 — TypeScript" → "3")
    - Render: numbered pill ("03") + heading text, with border-t and mt-12 above
    - Add id attribute: slugified heading text (for anchor navigation)
    - Tailwind: "border-t border-border pt-8 mt-12 mb-4 scroll-mt-6"
    - Add data-phase-heading attribute for IntersectionObserver (used by sidebar)

  h3 → SectionHeading:
    - Tailwind: "text-lg font-semibold mt-6 mb-3 text-foreground"

  ul → StyledList:
    - Tailwind: "space-y-2 my-4 ml-4 list-none"

  li → StyledListItem:
    - Custom bullet: small filled circle (use before: pseudo with Tailwind)
    - Tailwind: "flex gap-2 items-start text-muted-foreground leading-relaxed"

  blockquote → CalloutBox:
    - NOT a standard blockquote — render as a styled callout card
    - Tailwind: "border-l-4 border-primary bg-primary/5 rounded-r-md px-4 py-3 my-6
                 text-foreground [&>p]:m-0"

  code (inline) → InlineCode:
    - Tailwind: "bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary"

  pre → CodeBlock ("use client" component at src/components/roadmaps/CodeBlock.tsx):
    - Header bar: language label (left) + Copy button (right)
    - Copy button: clipboard SVG icon, on click copies code content
    - After copy: shows "Copied ✓" for 2 seconds, then reverts
    - Tailwind container: "rounded-lg overflow-hidden my-6 border border-border"
    - Header bar: "flex justify-between items-center px-4 py-2 bg-muted text-xs"

  a → SmartLink:
    - href starts with "http": open new tab, rel="noopener noreferrer", add ↗ after text
    - href starts with "/": use Next.js <Link>
    - Both: "text-primary underline-offset-2 hover:underline"

═══════════════════════════════════════
PART F — TECHNICAL CONSTRAINTS
═══════════════════════════════════════

- Page component: React Server Component (no "use client" at top level)
- Client sub-components (CodeBlock, RoadmapProgress, ActivePhaseHighlight): separate files
- Tailwind only — no inline styles, no CSS modules
- Dark mode: use dark: Tailwind variants throughout
- If getRoadmapBySlug returns null: call notFound() from next/navigation
- The page structure must be IDENTICAL for every slug — no slug-specific conditionals
  except for the data passed to components (meta, slug values)
```

---

---

# 🔴 PROMPT 4 — "From the Blog" Section

> **SKIP NOTE:** Skip if the section already exists in `[slug]/page.tsx`, shows posts
> from `meta.relatedPosts`, and renders nothing when relatedPosts is absent.

```
Update `src/app/roadmaps/[slug]/page.tsx` to add a "From the Blog" section.

This section renders inside the RIGHT COLUMN, below the MDX body.
It applies to EVERY roadmap that has a relatedPosts field — not only Full-Stack.

1. After getRoadmapBySlug(slug), check meta.relatedPosts for items.

2. Fetch post metadata for each slug using the existing blog post loader in src/lib/
   (e.g. getPostBySlug, getAllPosts, getPostsMeta — check what exists).
   Filter out any that return null — do not crash on missing slugs.

3. Render section structure:
   - <hr className="border-border my-12" />
   - <h2 className="text-2xl font-bold text-foreground mb-2">From the Blog</h2>
   - <p className="text-muted-foreground mb-6">Deep-dives that go further on topics in this roadmap</p>
   - Grid: className="grid grid-cols-1 sm:grid-cols-2 gap-4"

4. Each post card:
   Container: className="group bg-card border border-border rounded-lg p-4 
                          hover:border-primary/50 hover:shadow-sm transition-all"
   Wrap entire card in <Link href={`/blog/${post.slug}`}>
   
   Card contents:
   - First 2 tags: <SkillBadge /> for each (import from @/components/roadmaps/SkillBadge)
   - Post title: className="font-semibold text-foreground mt-2 group-hover:text-primary transition-colors"
   - Read time + arrow row: className="flex items-center justify-between mt-3 text-sm text-muted-foreground"
     Right side: → arrow that translates right on hover: className="group-hover:translate-x-1 transition-transform"

5. Maximum 6 posts even if relatedPosts has more.

6. If relatedPosts is undefined/empty: render absolutely nothing (no section wrapper, no heading).

7. Server Component — no "use client". All data fetched at build time.
```

---

---

# 🔴 PROMPT 5 — RoadmapProgress Component

> **SKIP NOTE:** Skip if `src/components/roadmaps/RoadmapProgress.tsx` exists with localStorage
> persistence, phase dot toggling, completion animation, and SSR skeleton loader.

```
Create `src/components/roadmaps/RoadmapProgress.tsx` for buildnscale.dev.
"use client"

This component renders a phase progress tracker for any roadmap.
Props:
  slug: string          // roadmap identifier — used as localStorage key
  totalPhases: number   // total phases in this roadmap (8 for AI Engineer, 10 for Full-Stack)

─────────────────────
STATE & PERSISTENCE
─────────────────────
localStorage key: `roadmap_progress_${slug}`
Stored value: { completedPhases: number[] }  — 1-based phase indices

Hydration safety:
  - Initialise state as: { completedPhases: [], hydrated: false }
  - In useEffect on mount: read localStorage, update state + set hydrated: true
  - While hydrated === false: render skeleton (grey bar + grey dots, same dimensions as real UI)
  - This prevents SSR/hydration mismatch entirely

Persistence:
  - Write to localStorage in a useEffect with [completedPhases] dependency
  - Write immediately on every toggle — no save button

─────────────────────
VISUAL STRUCTURE
─────────────────────
1. Progress bar:
   - Track: className="w-full h-2 bg-muted rounded-full overflow-hidden"
   - Fill: className="h-full bg-primary rounded-full transition-all duration-500"
   - Width style: `${(completedPhases.length / totalPhases) * 100}%`

2. Label below bar:
   - Default: "${completedPhases.length} of ${totalPhases} phases completed · ${percent}%"
   - All complete: "🎉 All phases complete!" in green text

3. Phase dot row (flex-wrap):
   One <button> per phase. States:
   - Completed: className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold"  content: ✓
   - Current (first incomplete): className="ring-2 ring-primary ring-offset-2 bg-background text-primary rounded-full w-8 h-8 flex items-center justify-center text-xs font-medium animate-pulse"  content: phase number
   - Future: className="bg-muted text-muted-foreground rounded-full w-8 h-8 flex items-center justify-center text-xs"  content: phase number
   
   Each button:
     aria-label={`${isCompleted ? "Unmark" : "Mark"} phase ${n} as ${isCompleted ? "incomplete" : "complete"}`}
     onClick: toggle phase n in completedPhases array

4. Reset link:
   className="text-xs text-muted-foreground underline hover:text-destructive cursor-pointer mt-2 block"
   onClick: window.confirm("Reset all progress for this roadmap?") → if confirmed, clear state + localStorage key

─────────────────────
COMPLETION ANIMATION
─────────────────────
When completedPhases.length === totalPhases:
  - Add a CSS class to the progress bar fill that triggers a brief glow animation
  - Define the keyframe with Tailwind's arbitrary [keyframes] syntax or an inline style
  - Change bar colour to green (bg-green-500)

─────────────────────
SKELETON
─────────────────────
While !hydrated render:
  <div className="animate-pulse space-y-3">
    <div className="h-2 bg-muted rounded-full" />
    <div className="h-4 w-48 bg-muted rounded" />
    <div className="flex gap-2">
      {Array.from({ length: totalPhases }).map((_, i) => (
        <div key={i} className="w-8 h-8 bg-muted rounded-full" />
      ))}
    </div>
  </div>

Constraints: Tailwind only. Dark mode support. Under 200 lines. No animation libraries.
```

---

---

# 🔴 PROMPT 6 — Roadmaps Index Page (`roadmaps/page.tsx`)

> **SKIP NOTE:** Skip if the page already has generateMetadata, CollectionPage JSON-LD,
> hero section, filter bar, dynamic card grid from getAllRoadmaps(), Full-Stack showing as
> a live card (NOT "Coming Soon"), and DevOps as the only "Coming Soon" placeholder.
> **RUN IF:** Full-Stack is still "Coming Soon", or the page has hardcoded dummy data.

```
Rewrite `src/app/roadmaps/page.tsx` for buildnscale.dev.
React Server Component — no "use client" at page level.

═══════════════════════
SEO — generateMetadata
═══════════════════════
title: "Developer Roadmaps 2026 | BuildnScale"
description: "Free, opinionated learning roadmaps for 2026. Structured paths for Full-Stack
Web Development and AI Engineering — written from real production experience by M. Yousuf."
openGraph type: "website"
canonical: "https://buildnscale.dev/roadmaps"
twitter card: "summary_large_image"

═══════════════════════
JSON-LD — CollectionPage
═══════════════════════
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Developer Roadmaps 2026 | BuildnScale",
  "description": "[same as meta description above]",
  "url": "https://buildnscale.dev/roadmaps",
  "inLanguage": "en",
  "author": { "@type": "Person", "name": "M. Yousuf", "url": "https://buildnscale.dev/author" },
  "hasPart": [
    { "@type": "LearningResource", "name": "Full-Stack Web Developer Roadmap 2026", "url": "https://buildnscale.dev/roadmaps/full-stack-developer" },
    { "@type": "LearningResource", "name": "AI Engineer Roadmap 2026", "url": "https://buildnscale.dev/roadmaps/ai-engineer" }
  ]
}

═══════════════════════
HERO SECTION
═══════════════════════
<h1> "Developer Roadmaps"
Subheading: "Structured, opinionated learning paths built from real production experience — not recycled tutorials."
Three stat pills (dynamically populated):
  - `${roadmaps.length} Career Paths`  (from getAllRoadmaps().length)
  - "Updated March 2026"
  - "100% Free"

═══════════════════════
FILTER BAR (client component)
═══════════════════════
Extract as `<RoadmapFilterBar roadmaps={roadmaps} />` — "use client"
File: `src/components/roadmaps/RoadmapFilterBar.tsx`

  - Tabs: "All" | "Full-Stack" | "AI & ML" | "DevOps & Cloud"
  - Active tab stored in URL: ?category=full-stack (useSearchParams + useRouter.replace)
  - Filtering is client-side — roadmaps data is passed as a prop from the RSC parent
  - Category matching:
      "Full-Stack" tab → show roadmaps where category === "Full-Stack Development"
      "AI & ML" tab    → show roadmaps where category === "AI & Machine Learning"
      "All" tab        → show all
  - Filtered cards: simple opacity+translate CSS transition (no Framer Motion)
  - Tab styling: selected tab has bg-primary text-primary-foreground, others are ghost/outline

═══════════════════════
ROADMAP CARDS GRID
═══════════════════════
Fetch: const roadmaps = await getAllRoadmaps()

Featured roadmaps section (both Full-Stack and AI Engineer have featured: true):
  "grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
  <RoadmapCard roadmap={r} featured={true} /> for each featured roadmap

Non-featured roadmaps (any future roadmap with featured: false):
  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
  <RoadmapCard roadmap={r} featured={false} /> for each

═══════════════════════
COMING SOON SECTION
═══════════════════════
Heading: "More Roadmaps Coming"
ONE placeholder card for "DevOps & Cloud" only (Full-Stack is now live — remove it from here):
  - Badge: ☁️
  - Title: "DevOps & Cloud"
  - Greyed out styling, "Coming Soon" pill
  - "Notify Me" button → links to newsletter section on the page

═══════════════════════
BOTTOM CTA
═══════════════════════
"Have a topic you want covered as a roadmap? Suggest one →"
Link to: mailto:hello@buildnscale.dev

Constraints: Tailwind only. No external UI libraries. Dark mode support.
```

---

---

# 🟡 PROMPT 7 — SkillBadge Component

> **SKIP NOTE:** Skip if `src/components/roadmaps/SkillBadge.tsx` already exists.

```
Create `src/components/roadmaps/SkillBadge.tsx` for buildnscale.dev.

A small, reusable tag pill component used throughout the roadmap pages.
Used in: RoadmapCard, RoadmapHero, "From the Blog" post cards, MDX tag displays.

Props:
  label: string
  variant?: "default" | "primary" | "muted"   // default: "muted"

Styles by variant:
  muted:   "bg-muted text-muted-foreground"
  primary: "bg-primary/10 text-primary"
  default: "bg-muted text-muted-foreground"    (same as muted)

Base classes (applied to all):
  "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium font-mono whitespace-nowrap"

This is a Server Component — no "use client" needed.
```

---

---

# 🟡 PROMPT 8 — RoadmapHero Component

> **SKIP NOTE:** Skip if `src/components/roadmaps/RoadmapHero.tsx` already exists and renders
> badge, title, headline, difficulty pill, duration, module count, lastUpdated, and tags row.

```
Create `src/components/roadmaps/RoadmapHero.tsx` for buildnscale.dev.
Server Component — no interactivity.

Props:
  meta: RoadmapMeta   // import from @/lib/roadmaps

This renders at the very top of every individual roadmap page, above the progress tracker.
It must look identical on both /roadmaps/full-stack-developer and /roadmaps/ai-engineer.

Structure (top to bottom):

1. Badge + category row:
   - Badge: large emoji in a rounded-xl bg-primary/10 container (text-4xl p-3 inline-block)
   - Category: className="text-sm font-medium text-primary uppercase tracking-wider ml-3"

2. Title <h1>:
   - meta.title
   - className="text-3xl md:text-4xl font-extrabold text-foreground mt-4 leading-tight"

3. Headline <p>:
   - meta.headline
   - className="text-lg text-muted-foreground mt-2 max-w-2xl leading-relaxed"

4. Stats row:
   Horizontal flex-wrap row of stat items. Each item: icon + label.
   - Difficulty pill: colour-coded (green/yellow/red) same logic as RoadmapCard
   - Duration: "⏱ " + meta.duration
   - Phases: "📚 " + meta.modules + " phases"
   - Updated: "🗓 Updated " + formatted date (e.g. "Mar 2026" from meta.lastUpdated)
   Row className: "flex flex-wrap items-center gap-3 mt-4 text-sm"
   Non-pill items className: "flex items-center gap-1 text-muted-foreground"

5. Tags row:
   - First 6 tags as <SkillBadge label={tag} variant="primary" />
   - If more than 6: plain text pill "+ N more" in muted style
   - className="flex flex-wrap gap-2 mt-4"

6. Bottom divider:
   - <hr className="border-border mt-8 mb-0" />

Import SkillBadge from @/components/roadmaps/SkillBadge.
```

---

---

# 🟡 PROMPT 9 — RoadmapSidebar Component

> **SKIP NOTE:** Skip if the sidebar is already extracted as a component and contains all 5
> sections: stats card, prerequisites, outcomes, phase navigation, and share CTA.

```
Create `src/components/roadmaps/RoadmapSidebar.tsx` for buildnscale.dev.

This is the sticky left-column sidebar on every individual roadmap page.
It must be structurally identical on both /roadmaps/full-stack-developer and /roadmaps/ai-engineer.

Props:
  meta: RoadmapMeta
  slug: string

The component itself is a Server Component.
The active-heading behaviour is extracted to a separate client component.

═══════════════════════
STRUCTURE (render in this exact order)
═══════════════════════

1. STATS CARD
   className="bg-card border border-border rounded-xl p-4 space-y-3 mb-6"
   Contents:
   - Top row: badge emoji (text-3xl) + title (text-sm font-semibold) in a flex row
   - <hr className="border-border" />
   - Four stat rows, each: small icon text + value
       Difficulty: [colour-coded pill — Beginner=green, Intermediate=yellow, Advanced=red]
       Duration:   "⏱ " + meta.duration
       Phases:     "📚 " + meta.modules + " phases"
       Updated:    "🗓 " + formatted meta.lastUpdated

2. PREREQUISITES
   Heading: className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-6"
   Text: "Prerequisites"
   <ul className="space-y-1">
     Each item: className="text-sm text-muted-foreground flex gap-2 items-start"
     Bullet: a small "·" or "–" character before each item

3. WHAT YOU'LL LEARN (Outcomes)
   Heading: "What You'll Learn" (same heading style as Prerequisites)
   <ul className="space-y-1.5">
     Each item: ✓ (text-green-500) + className="text-sm text-muted-foreground"
   No interactivity — purely visual checkmarks, not actual checkboxes

4. PHASE NAVIGATION
   Heading: "Phases" (same heading style)
   <nav aria-label="Jump to phase">
     One link per phase derived from meta:
     For i from 1 to meta.modules:
       <a href={`#phase-${i}`} className="block text-sm text-muted-foreground
                                          hover:text-foreground hover:translate-x-1
                                          transition-all py-1 pl-3
                                          border-l-2 border-transparent
                                          data-[active=true]:border-primary
                                          data-[active=true]:text-foreground
                                          data-[active=true]:font-medium">
         Phase {i}
       </a>
   Wrap this nav in <ActivePhaseHighlight> client component (see below)

5. SHARE CTA
   className="bg-muted/40 rounded-xl p-4 mt-6"
   Heading: "Found this helpful?" (text-sm font-semibold)
   Subtext: "Share with someone learning to code." (text-xs text-muted-foreground)
   Two buttons side by side (mt-3 flex gap-2):
   - Twitter: href=`https://twitter.com/intent/tweet?text=${encodeURIComponent(meta.title)}&url=https://buildnscale.dev/roadmaps/${slug}`
     Label: "Share on X"
   - LinkedIn: href=`https://www.linkedin.com/shareArticle?mini=true&url=https://buildnscale.dev/roadmaps/${slug}&title=${encodeURIComponent(meta.title)}`
     Label: "Share on LinkedIn"
   Button style: "text-xs bg-background border border-border rounded-lg px-3 py-2
                  hover:bg-muted transition-colors inline-flex items-center gap-1.5"

═══════════════════════
ActivePhaseHighlight — extract as separate file
═══════════════════════
File: src/components/roadmaps/ActivePhaseHighlight.tsx
"use client"

Props: children: React.ReactNode

Uses IntersectionObserver to detect which h2[data-phase-heading] is in the viewport.
Sets data-active="true" on the corresponding sidebar link (matching by href anchor).
Threshold: 0.3 (activates when 30% of the heading is visible).
Cleanup: disconnect observer on unmount.
```

---

---

# 🟡 PROMPT 10 — SEO: Sitemap & Robots (Complete & Dynamic)

> **SKIP NOTE:** Skip if sitemap.ts uses getRoadmapSlugs() dynamically (not hardcoded)
> AND robots.ts already exists with correct allow/disallow rules.
> **RUN IF:** Sitemap is missing roadmap entries, uses a hardcoded list, or robots.ts is absent.

```
Update `src/app/sitemap.ts` and create/update `src/app/robots.ts` for buildnscale.dev.

═══════════════════
SITEMAP
═══════════════════
Import:
  - getAllPosts (or equivalent) from @/lib/posts
  - getRoadmapSlugs from @/lib/roadmaps

The sitemap must be fully dynamic — dropping a new .mdx file into content/roadmaps/
automatically adds its URL. No hardcoded roadmap slugs.

Return entries for:

1. Static pages:
   https://buildnscale.dev             priority: 1.0  changeFreq: "weekly"
   https://buildnscale.dev/blog        priority: 0.9  changeFreq: "daily"
   https://buildnscale.dev/roadmaps    priority: 0.9  changeFreq: "monthly"
   https://buildnscale.dev/projects    priority: 0.7  changeFreq: "monthly"
   https://buildnscale.dev/resources   priority: 0.7  changeFreq: "monthly"
   https://buildnscale.dev/author      priority: 0.6  changeFreq: "monthly"

2. Blog posts (dynamic via getAllPosts()):
   https://buildnscale.dev/blog/${slug}
   priority: 0.8  changeFreq: "monthly"  lastModified: post.date

3. Roadmap pages (dynamic via getRoadmapSlugs()):
   https://buildnscale.dev/roadmaps/${slug}
   priority: 0.85  changeFreq: "monthly"  lastModified: new Date()

Return type: MetadataRoute.Sitemap

// Expected output comment at top:
// Roadmap entries: /roadmaps/ai-engineer, /roadmaps/full-stack-developer
// (auto-grows as new MDX files are added to src/content/roadmaps/)

═══════════════════
ROBOTS
═══════════════════
File: src/app/robots.ts
Return type: MetadataRoute.Robots

rules: [{
  userAgent: "*",
  allow: ["/", "/blog/", "/roadmaps/", "/projects/", "/resources/", "/author/"],
  disallow: ["/api/", "/_next/", "/search"],
}]
sitemap: "https://buildnscale.dev/sitemap.xml"
```

---

---

# 🟡 PROMPT 11 — Roadmap Layout: Banner + Back-Link

> **SKIP NOTE:** Skip if `src/app/roadmaps/layout.tsx` exists with a dismissible banner
> (localStorage key: roadmap_banner_v2_dismissed) AND a "← All Roadmaps" back-link
> that only shows on individual roadmap pages.
> **RUN IF:** Layout doesn't exist, or banner still shows old AI-Engineer-only text.

```
Create or update `src/app/roadmaps/layout.tsx` for buildnscale.dev.

Wraps all pages under /roadmaps — index and all individual roadmap pages.

═══════════════════════════════════
COMPONENT: RoadmapBanner
File: src/components/roadmaps/RoadmapBanner.tsx
"use client"
═══════════════════════════════════
localStorage key: "roadmap_banner_v2_dismissed"

Hydration strategy:
  - Initialise visible state as false
  - In useEffect: if localStorage key is NOT "true", set visible to true
  - Renders nothing until after hydration (prevents flash)

Banner text:
  "🎉 Two roadmaps are now live — Full-Stack Web Developer & AI Engineer. Both 100% free."

Dismiss button:
  - Position: absolute right-3 top-1/2 -translate-y-1/2
  - Content: × character
  - aria-label: "Dismiss announcement"
  - onClick: localStorage.setItem(key, "true"), setVisible(false)

Banner styling:
  className="relative w-full bg-primary/10 text-foreground text-sm py-2.5 px-4 text-center pr-10"
  Not sticky — scrolls away with page content.

═══════════════════════════════════
COMPONENT: BackToRoadmaps (can be inline in layout or extracted)
"use client" — needs usePathname
═══════════════════════════════════
const pathname = usePathname()
const isIndividualPage = pathname.startsWith("/roadmaps/") && pathname !== "/roadmaps"

If isIndividualPage:
  Render: <Link href="/roadmaps">← All Roadmaps</Link>
  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1
             transition-colors py-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"

If NOT isIndividualPage: return null

═══════════════════════════════════
LAYOUT STRUCTURE
═══════════════════════════════════
Server Component at the top level.

Render order:
  1. <RoadmapBanner />
  2. <BackToRoadmaps />
  3. <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
       {children}
     </main>

The max-width and padding must match the container used elsewhere on the site.
```

---

---

# 🟡 PROMPT 12 — Blog ↔ Roadmap Internal Linking (`RoadmapCTA`)

> **SKIP NOTE:** Skip if `src/components/roadmaps/RoadmapCTA.tsx` exists and is already
> wired into the blog post sidebar, covering all 9 posts correctly.

```
Create `src/components/roadmaps/RoadmapCTA.tsx` and wire it into every blog post sidebar.
Server Component — no "use client" needed (it's a static styled link block).

Props:
  tags: string[]    // the current blog post's tags array

Logic — match the FIRST tag in the array against this map:

const ROADMAP_TAG_MAP = {
  "Next.js":            { slug: "full-stack-developer", badge: "🚀", title: "Full-Stack Developer Roadmap", teaser: "Building with Next.js? See the complete full-stack path →" },
  "TypeScript":         { slug: "full-stack-developer", badge: "🚀", title: "Full-Stack Developer Roadmap", teaser: "TypeScript is Phase 4 of the Full-Stack Roadmap →" },
  "JavaScript":         { slug: "full-stack-developer", badge: "🚀", title: "Full-Stack Developer Roadmap", teaser: "JavaScript fundamentals are Phase 2 — see the full path →" },
  "React":              { slug: "full-stack-developer", badge: "🚀", title: "Full-Stack Developer Roadmap", teaser: "React is Phase 5 of the Full-Stack Roadmap →" },
  "FastAPI":            { slug: "full-stack-developer", badge: "🚀", title: "Full-Stack Developer Roadmap", teaser: "FastAPI is Phase 7 of the Full-Stack Roadmap →" },
  "Docker":             { slug: "full-stack-developer", badge: "🚀", title: "Full-Stack Developer Roadmap", teaser: "Containerisation is Phase 10 — part of the full-stack path →" },
  "Authentication":     { slug: "full-stack-developer", badge: "🚀", title: "Full-Stack Developer Roadmap", teaser: "Auth is Phase 9 of the Full-Stack Roadmap →" },
  "Security":           { slug: "full-stack-developer", badge: "🚀", title: "Full-Stack Developer Roadmap", teaser: "Security is covered in Phase 9 of the Full-Stack Roadmap →" },
  "DevOps":             { slug: "full-stack-developer", badge: "🚀", title: "Full-Stack Developer Roadmap", teaser: "DevOps & deployment is Phase 10 — the full-stack capstone →" },
  "LangChain":          { slug: "ai-engineer",          badge: "🤖", title: "AI Engineer Roadmap",          teaser: "Building with LangChain? See the complete AI Engineer path →" },
  "RAG":                { slug: "ai-engineer",          badge: "🤖", title: "AI Engineer Roadmap",          teaser: "RAG is Phase 6 of the AI Engineer Roadmap →" },
  "LLM":                { slug: "ai-engineer",          badge: "🤖", title: "AI Engineer Roadmap",          teaser: "LLMs are covered in Phase 5 of the AI Engineer Roadmap →" },
  "AI":                 { slug: "ai-engineer",          badge: "🤖", title: "AI Engineer Roadmap",          teaser: "Building AI apps? See the full AI Engineer path →" },
  "Multi-Agent":        { slug: "ai-engineer",          badge: "🤖", title: "AI Engineer Roadmap",          teaser: "Multi-agent systems are Phase 7 of the AI Engineer Roadmap →" },
  "Prompt Engineering": { slug: "ai-engineer",          badge: "🤖", title: "AI Engineer Roadmap",          teaser: "Prompt engineering is Phase 5 — part of the full AI path →" },
  "Python":             { slug: "ai-engineer",          badge: "🤖", title: "AI Engineer Roadmap",          teaser: "Python is the foundation of the AI Engineer Roadmap →" },
}

Find the first tag in `tags` array that exists as a key in this map.
If no match: return null (render nothing, no empty space).

Rendered output when match found:
  Outer: className="border-l-4 border-primary bg-primary/5 rounded-r-xl p-4 my-4"
  Label: "📍 Related Roadmap" — className="text-xs text-muted-foreground uppercase tracking-wide block mb-2"
  Badge + title: `${match.badge} ${match.title}` — className="font-semibold text-foreground text-sm"
  Teaser: match.teaser — className="text-sm text-muted-foreground mt-1 block"
  CTA link: "View Full Roadmap →"
    <Link href={`/roadmaps/${match.slug}`}
      className="block mt-3 text-center text-sm font-medium bg-primary text-primary-foreground
                 rounded-lg py-2 hover:bg-primary/90 transition-colors">

Wiring into blog sidebar:
  Find the blog post sidebar in src/components/ (may be PostSidebar, BlogSidebar,
  ArticleSidebar, or similar — search for what's used on /blog/[slug] pages).
  Import <RoadmapCTA /> and place it as the FIRST item in the sidebar,
  above newsletter, above related posts, above Fiverr CTAs.
  Pass: <RoadmapCTA tags={post.tags} />

Verify manually after implementing:
  /blog/deploying-nextjs-to-production     → 🚀 Full-Stack CTA  (Next.js tag)
  /blog/typescript-generics-deep-dive      → 🚀 Full-Stack CTA  (TypeScript tag)
  /blog/nextjs-fastapi-stack               → 🚀 Full-Stack CTA  (Next.js tag)
  /blog/building-stateful-chatbot-fastapi  → 🚀 Full-Stack CTA  (FastAPI tag)
  /blog/dockerizing-fastapi-apps           → 🚀 Full-Stack CTA  (Docker tag)
  /blog/secure-encryption-python           → 🚀 Full-Stack CTA  (Security tag)
  /blog/rag-with-langchain-and-pinecone    → 🤖 AI Engineer CTA (LangChain tag)
  /blog/prompt-engineering-best-practices  → 🤖 AI Engineer CTA (Prompt Engineering tag)
  /blog/multi-agent-emergency-response     → 🤖 AI Engineer CTA (Multi-Agent tag)
```

---

---

# ✅ COMPLETE PRODUCTION CHECKLIST

Run every item. Nothing is optional.

---

### 📄 Content
- [ ] `full-stack-developer.mdx` placed at `src/content/roadmaps/full-stack-developer.mdx`
- [ ] All 10 phases render at `http://localhost:3000/roadmaps/full-stack-developer`
- [ ] All 6 internal blog post links within MDX resolve to live `/blog/` pages
- [ ] "What Comes After" section links to `/roadmaps/ai-engineer` — page exists and loads
- [ ] All external resource links open in new tab with ↗ icon
- [ ] Every milestone project in all 10 phases is realistic and buildable

---

### 🔍 SEO — Individual Roadmap Page
- [ ] `<title>`: "Full-Stack Web Developer Roadmap 2026 | BuildnScale"
- [ ] `<meta name="description">` matches frontmatter description
- [ ] `LearningResource` JSON-LD in page source — validate: https://validator.schema.org
- [ ] `LearningResource.educationalLevel` = "Beginner"
- [ ] `LearningResource.teaches` array contains all 14 frontmatter tags
- [ ] `LearningResource.author.name` = "M. Yousuf"
- [ ] `BreadcrumbList` JSON-LD in page source — also validate
- [ ] Canonical: `https://buildnscale.dev/roadmaps/full-stack-developer`
- [ ] OG image renders: check https://cards-dev.twitter.com/validator
- [ ] `/roadmaps/full-stack-developer` appears in `/sitemap.xml`

### 🔍 SEO — Roadmaps Index Page
- [ ] `<title>`: "Developer Roadmaps 2026 | BuildnScale"
- [ ] `CollectionPage` JSON-LD has both roadmaps in `hasPart`
- [ ] `/roadmaps` appears in `/sitemap.xml` with priority 0.9
- [ ] `/robots.txt` allows crawling of `/roadmaps/`

---

### 🧩 Structural Parity — CRITICAL
Open `/roadmaps/full-stack-developer` and `/roadmaps/ai-engineer` side-by-side in browser.

- [ ] Both pages have IDENTICAL two-column layout (sidebar 300px + content column)
- [ ] Both sidebars have same 5 sections in same order: stats → prerequisites → outcomes → phases → share
- [ ] Both pages have RoadmapHero at top of content column
- [ ] Both pages have RoadmapProgress below the hero
- [ ] Both pages have breadcrumb nav (Home > Roadmaps > [Title])
- [ ] Both pages use identical MDX component styling:
    - [ ] Phase h2 headers: numbered pill + border-t + mt-12
    - [ ] Section h3 subheadings: same size and colour
    - [ ] Callout blockquotes: left border + bg-primary/5
    - [ ] Code blocks: language label + copy button header bar
    - [ ] External links: ↗ icon + new tab
- [ ] Both pages have "From the Blog" section at the bottom (if relatedPosts set in frontmatter)
- [ ] Both pages have identical Share CTA in sidebar (Twitter + LinkedIn)

---

### ⚙️ Component Functionality
- [ ] RoadmapProgress on `/roadmaps/full-stack-developer`:
    - [ ] Shows exactly 10 dots (not 8)
    - [ ] localStorage key: `roadmap_progress_full-stack-developer`
    - [ ] Dots toggle on click (click once: complete, click again: incomplete)
    - [ ] Progress bar fills correctly (1 dot = 10%, 5 dots = 50%, 10 dots = 100%)
    - [ ] Completion animation fires when all 10 marked
    - [ ] Reset works with confirm dialog
    - [ ] SSR skeleton shows while hydrating — no hydration error in console
- [ ] RoadmapProgress on `/roadmaps/ai-engineer`:
    - [ ] Shows exactly 8 dots (not 10)
    - [ ] localStorage key: `roadmap_progress_ai-engineer`
    - [ ] Progress from Full-Stack does NOT affect AI Engineer (separate keys)
- [ ] Phase nav in sidebar scrolls to correct heading on click (both pages)
- [ ] Active phase highlighting updates as user scrolls (both pages)
- [ ] Code block Copy button: copies code, shows "Copied ✓" for 2 seconds, reverts
- [ ] External links in MDX: open new tab, have ↗ icon

---

### 🎨 UI & Dark Mode
- [ ] Toggle dark mode — both roadmap pages look correct in both modes
- [ ] `/roadmaps` index page renders correctly in dark/light mode
- [ ] `RoadmapBanner`: shows on first visit, dismisses on ×, does not re-appear after dismiss
- [ ] "← All Roadmaps" link: appears on `/roadmaps/full-stack-developer` ✓
- [ ] "← All Roadmaps" link: does NOT appear on `/roadmaps` ✓
- [ ] Filter tabs on `/roadmaps`: each tab shows the correct roadmap(s)
- [ ] Full-Stack card: green "Beginner" difficulty badge
- [ ] AI Engineer card: yellow "Intermediate" difficulty badge

---

### 🔗 Internal Linking — verify all 9 blog posts
- [ ] `/blog/deploying-nextjs-to-production` sidebar → 🚀 Full-Stack CTA
- [ ] `/blog/typescript-generics-deep-dive` sidebar → 🚀 Full-Stack CTA
- [ ] `/blog/nextjs-fastapi-stack` sidebar → 🚀 Full-Stack CTA
- [ ] `/blog/building-stateful-chatbot-fastapi` sidebar → 🚀 Full-Stack CTA
- [ ] `/blog/dockerizing-fastapi-apps` sidebar → 🚀 Full-Stack CTA
- [ ] `/blog/secure-encryption-python` sidebar → 🚀 Full-Stack CTA
- [ ] `/blog/rag-with-langchain-and-pinecone` sidebar → 🤖 AI Engineer CTA
- [ ] `/blog/prompt-engineering-best-practices` sidebar → 🤖 AI Engineer CTA
- [ ] `/blog/multi-agent-emergency-response` sidebar → 🤖 AI Engineer CTA
- [ ] `/roadmaps/full-stack-developer` "From the Blog" shows 6 posts
- [ ] `/roadmaps/full-stack-developer` "What Comes After" → /roadmaps/ai-engineer works

---

### ⚡ Build & Performance
- [ ] `npm run build` — zero TypeScript errors
- [ ] `npm run build` — zero ESLint errors
- [ ] `.next/server/app/roadmaps/full-stack-developer/index.html` exists (static generation confirmed)
- [ ] `.next/server/app/roadmaps/ai-engineer/index.html` exists (static generation confirmed)
- [ ] Browser console: zero hydration errors, zero unhandled errors
- [ ] Lighthouse on `/roadmaps/full-stack-developer`:
    - [ ] Performance ≥ 85
    - [ ] Accessibility ≥ 95
    - [ ] Best Practices ≥ 95
    - [ ] SEO = 100

---

### ♿ Accessibility
- [ ] Breadcrumb: `<nav aria-label="Breadcrumb">` with `<ol>`, last item `aria-current="page"`
- [ ] Phase dots: each `<button>` has descriptive `aria-label`
- [ ] RoadmapProgress: keyboard navigable (Tab to focus, Enter/Space to toggle)
- [ ] RoadmapCard: `<article aria-label={roadmap.title}>`
- [ ] Sidebar phase nav: `<nav aria-label="Jump to phase">`
- [ ] Focus rings visible on all interactive elements
- [ ] Colour contrast passes WCAG AA for all text/background combinations

---

## 📌 CONTENT STRATEGY: SEO LINK GRAPH

Both roadmaps live = a topically coherent cluster Google can index:

```
/blog/deploying-nextjs-to-production     ──→  /roadmaps/full-stack-developer
/blog/typescript-generics-deep-dive      ──→  /roadmaps/full-stack-developer
/blog/nextjs-fastapi-stack               ──→  /roadmaps/full-stack-developer
/blog/building-stateful-chatbot-fastapi  ──→  /roadmaps/full-stack-developer
/blog/dockerizing-fastapi-apps           ──→  /roadmaps/full-stack-developer
/blog/secure-encryption-python           ──→  /roadmaps/full-stack-developer
/blog/rag-with-langchain-and-pinecone    ──→  /roadmaps/ai-engineer
/blog/prompt-engineering-best-practices  ──→  /roadmaps/ai-engineer
/blog/multi-agent-emergency-response     ──→  /roadmaps/ai-engineer
/roadmaps/full-stack-developer           ──→  /roadmaps/ai-engineer  ("What Comes After")
/roadmaps/full-stack-developer           ──→  6 blog posts  ("From the Blog")
/roadmaps/ai-engineer                    ──→  blog posts    ("From the Blog" when added)
```

Next 4 blog posts that directly serve the Full-Stack roadmap:
1. "React Server Components: Practical Guide"          → Phase 6
2. "PostgreSQL Schema Design for Developers"           → Phase 8
3. "NextAuth.js v5 Complete Authentication Guide"      → Phase 9
4. "GitHub Actions CI/CD for Full-Stack Developers"    → Phase 10

---

*Complete standalone prompt pack — Full-Stack Developer Roadmap | buildnscale.dev*
*Run 🔴 prompts 1–6 first (in order). Run 🟡 prompts 7–12 in any order.*
*Each prompt has a SKIP NOTE — read it before running to avoid overwriting working code.*