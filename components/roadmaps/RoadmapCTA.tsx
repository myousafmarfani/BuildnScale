import Link from 'next/link';

type RoadmapCtaItem = {
  slug: string;
  title: string;
  teaser: string;
};

const ROADMAP_TAG_MAP: Record<string, RoadmapCtaItem> = {
  'Next.js': {
    slug: 'full-stack-developer',
    title: 'Full-Stack Developer Roadmap',
    teaser: 'Building with Next.js? See the complete full-stack path →',
  },
  TypeScript: {
    slug: 'full-stack-developer',
    title: 'Full-Stack Developer Roadmap',
    teaser: 'TypeScript is Phase 4 of the Full-Stack Roadmap →',
  },
  JavaScript: {
    slug: 'full-stack-developer',
    title: 'Full-Stack Developer Roadmap',
    teaser: 'JavaScript fundamentals are Phase 2 — see the full path →',
  },
  React: {
    slug: 'full-stack-developer',
    title: 'Full-Stack Developer Roadmap',
    teaser: 'React is Phase 5 of the Full-Stack Roadmap →',
  },
  FastAPI: {
    slug: 'full-stack-developer',
    title: 'Full-Stack Developer Roadmap',
    teaser: 'FastAPI is Phase 7 of the Full-Stack Roadmap — see the full path →',
  },
  Docker: {
    slug: 'full-stack-developer',
    title: 'Full-Stack Developer Roadmap',
    teaser: 'Containerisation is Phase 10 — part of the full-stack path →',
  },
  Authentication: {
    slug: 'full-stack-developer',
    title: 'Full-Stack Developer Roadmap',
    teaser: 'Auth is Phase 9 of the Full-Stack Roadmap →',
  },
  Security: {
    slug: 'full-stack-developer',
    title: 'Full-Stack Developer Roadmap',
    teaser: 'Security is covered in Phase 9 of the Full-Stack Roadmap →',
  },
  DevOps: {
    slug: 'full-stack-developer',
    title: 'Full-Stack Developer Roadmap',
    teaser: 'DevOps & deployment is Phase 10 — the full-stack capstone →',
  },
  LangChain: {
    slug: 'ai-engineer',
    title: 'AI Engineer Roadmap',
    teaser: 'Building with LangChain? See the complete AI Engineer path →',
  },
  RAG: {
    slug: 'ai-engineer',
    title: 'AI Engineer Roadmap',
    teaser: 'RAG is Phase 6 of the AI Engineer Roadmap →',
  },
  LLM: {
    slug: 'ai-engineer',
    title: 'AI Engineer Roadmap',
    teaser: 'LLMs are covered in Phase 5 of the AI Engineer Roadmap →',
  },
  AI: {
    slug: 'ai-engineer',
    title: 'AI Engineer Roadmap',
    teaser: 'Building AI apps? See the full AI Engineer path →',
  },
  'Multi-Agent': {
    slug: 'ai-engineer',
    title: 'AI Engineer Roadmap',
    teaser: 'Multi-agent systems are Phase 7 of the AI Engineer Roadmap →',
  },
  Python: {
    slug: 'ai-engineer',
    title: 'AI Engineer Roadmap',
    teaser: 'Python is the foundation of the AI Engineer Roadmap →',
  },
  'Prompt Engineering': {
    slug: 'ai-engineer',
    title: 'AI Engineer Roadmap',
    teaser: 'Prompt engineering is Phase 5 — part of the full AI path →',
  },
};

export default function RoadmapCTA({ tags }: { tags: string[] }) {
  const match = tags.find((tag) => ROADMAP_TAG_MAP[tag]);
  const item = match ? ROADMAP_TAG_MAP[match] : null;

  if (!item) {
    return null;
  }

  return (
    <div className="my-4 rounded-r-xl border-l-4 border-primary bg-primary/5 p-4">
      <span className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground">
        Related Roadmap
      </span>
      <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
      <span className="mt-1 block text-sm text-muted-foreground">{item.teaser}</span>
      <Link
        href={`/roadmaps/${item.slug}`}
        className="mt-3 block rounded-lg bg-primary py-2 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        View Full Roadmap →
      </Link>
    </div>
  );
}
