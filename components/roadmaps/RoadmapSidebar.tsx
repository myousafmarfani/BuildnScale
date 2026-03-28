import type { RoadmapMeta } from '@/lib/roadmaps';
import ActivePhaseHighlight from '@/components/roadmaps/ActivePhaseHighlight';

function difficultyClass(level: RoadmapMeta['difficulty']) {
  if (level === 'Beginner') return 'bg-green-500/15 text-green-600 dark:text-green-400';
  if (level === 'Advanced') return 'bg-red-500/15 text-red-600 dark:text-red-400';
  return 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-300';
}

function formatMonthYear(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

type RoadmapSidebarProps = {
  meta: RoadmapMeta;
  slug: string;
};

export default function RoadmapSidebar({ meta, slug }: RoadmapSidebarProps) {
  const pageUrl = `https://www.buildnscale.dev/roadmaps/${slug}`;

  return (
    <aside className="rounded-2xl border border-blue-200/70 bg-linear-to-b from-blue-50 to-cyan-50 p-4 dark:border-blue-900/50 dark:from-blue-950/30 dark:to-cyan-950/20">
      <section className="mb-6 space-y-3 rounded-xl border border-blue-200/70 bg-white/90 p-4 dark:border-blue-900/40 dark:bg-zinc-900/80">
        <div className="flex items-center gap-3">
          <p className="text-sm font-semibold text-foreground">{meta.title}</p>
        </div>
        <hr className="border-border" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Difficulty</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${difficultyClass(meta.difficulty)}`}>
            {meta.difficulty}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Duration</span>
          <span className="text-foreground">{meta.duration}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Phases</span>
          <span className="text-foreground">{meta.modules} phases</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Updated</span>
          <span className="text-foreground">{formatMonthYear(meta.lastUpdated)}</span>
        </div>
      </section>

      <h2 className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
        Prerequisites
      </h2>
      <ul className="space-y-1">
        {meta.prerequisites.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span aria-hidden="true">-</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <h2 className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
        What You&apos;ll Learn
      </h2>
      <ul className="space-y-1.5">
        {meta.outcomes.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="text-green-500" aria-hidden="true">
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <h2 className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
        Phases
      </h2>
      <ActivePhaseHighlight>
        <nav aria-label="Jump to phase">
          {Array.from({ length: meta.modules }, (_, index) => {
            const phase = index + 1;
            return (
              <a
                key={phase}
                href={`#phase-${phase}`}
                className="block border-l-2 border-transparent py-1 pl-3 text-sm text-muted-foreground transition-all hover:translate-x-1 hover:text-foreground data-[active=true]:border-primary data-[active=true]:font-medium data-[active=true]:text-foreground"
              >
                Phase {phase}
              </a>
            );
          })}
        </nav>
      </ActivePhaseHighlight>

      <section className="mt-6 rounded-xl border border-blue-200/70 bg-white/90 p-4 dark:border-blue-900/40 dark:bg-zinc-900/80">
        <h3 className="text-sm font-semibold text-foreground">Found this helpful?</h3>
        <p className="text-xs text-muted-foreground">Share with someone learning to code.</p>
        <div className="mt-3 flex gap-2">
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(meta.title)}&url=${encodeURIComponent(pageUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-xs text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300"
          >
            Share on X
          </a>
          <a
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(meta.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-xs text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300"
          >
            Share on LinkedIn
          </a>
        </div>
      </section>
    </aside>
  );
}
