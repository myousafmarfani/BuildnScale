import type { RoadmapMeta } from '@/lib/roadmaps';
import SkillBadge from '@/components/roadmaps/SkillBadge';

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

type RoadmapHeroProps = {
  meta: RoadmapMeta;
};

export default function RoadmapHero({ meta }: RoadmapHeroProps) {
  const extraTags = meta.tags.length - 6;

  return (
    <section className="rounded-2xl border border-blue-200/70 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 dark:border-blue-900/50 dark:from-blue-950/30 dark:to-cyan-950/20">
      <div className="flex items-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-300">Roadmap</span>
        <span className="ml-3 text-sm font-medium uppercase tracking-wider text-primary">
          {meta.category}
        </span>
      </div>

      <h1 className="mt-4 text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
        {meta.title}
      </h1>

      <p className="mt-2 max-w-2xl text-lg leading-relaxed text-muted-foreground">{meta.headline}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <span className={`rounded-full px-2.5 py-1 font-medium ${difficultyClass(meta.difficulty)}`}>
          {meta.difficulty}
        </span>
        <span className="flex items-center gap-1 text-muted-foreground">Duration: {meta.duration}</span>
        <span className="flex items-center gap-1 text-muted-foreground">Phases: {meta.modules}</span>
        <span className="flex items-center gap-1 text-muted-foreground">Updated {formatMonthYear(meta.lastUpdated)}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {meta.tags.slice(0, 6).map((tag) => (
          <SkillBadge key={tag} label={tag} variant="primary" />
        ))}
        {extraTags > 0 ? <SkillBadge label={`+ ${extraTags} more`} variant="muted" /> : null}
      </div>

      <hr className="mt-8 mb-0 border-border" />
    </section>
  );
}
