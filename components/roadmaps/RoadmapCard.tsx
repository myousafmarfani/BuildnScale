import Link from 'next/link';
import { RoadmapMeta } from '@/lib/roadmaps';
import { cn } from '@/lib/utils';
import SkillBadge from '@/components/roadmaps/SkillBadge';

type Props = {
  roadmap: RoadmapMeta;
  featured?: boolean;
};

function difficultyClass(level: RoadmapMeta['difficulty']) {
  if (level === 'Beginner') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
  if (level === 'Advanced') return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300';
  return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
}

export default function RoadmapCard({ roadmap, featured = false }: Props) {
  if (featured) {
    return (
      <article
        aria-label={roadmap.title}
        className="relative overflow-hidden rounded-3xl border border-blue-200/70 bg-gradient-to-br from-white via-blue-50/80 to-cyan-50/70 p-7 shadow-[0_10px_30px_rgba(59,130,246,0.07)] dark:border-blue-900/40 dark:from-zinc-900/70 dark:via-blue-950/25 dark:to-cyan-950/20"
      >
        <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-cyan-500" aria-hidden="true" />
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-300">Featured roadmap</span>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary" aria-label="Most popular roadmap">
            Most Popular
          </span>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-blue-900 dark:text-blue-100">{roadmap.title}</h2>
        <p className="mt-2 text-muted-foreground">{roadmap.headline}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', difficultyClass(roadmap.difficulty))}>{roadmap.difficulty}</span>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{roadmap.duration}</span>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{roadmap.modules} phases</span>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold">Prerequisites</h3>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {roadmap.prerequisites.slice(0, 3).map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Outcomes</h3>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {roadmap.outcomes.slice(0, 3).map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/roadmaps/${roadmap.slug}`} aria-label={`Start learning ${roadmap.title}`} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            Start Learning
          </Link>
          <Link href={`/roadmaps/${roadmap.slug}`} aria-label={`View curriculum for ${roadmap.title}`} className="rounded-xl border border-blue-300 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950/30">
            View Curriculum
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article aria-label={roadmap.title} className="rounded-2xl">
      <Link
        href={`/roadmaps/${roadmap.slug}`}
        aria-label={`Start roadmap ${roadmap.title}`}
        className="group block rounded-2xl border border-blue-200/70 bg-gradient-to-br from-white via-blue-50/85 to-cyan-50/65 p-6 shadow-[0_8px_24px_rgba(59,130,246,0.06)] transition hover:border-blue-400 hover:shadow-[0_14px_30px_rgba(59,130,246,0.14)] dark:border-blue-900/40 dark:from-zinc-900/65 dark:via-blue-950/20 dark:to-cyan-950/15"
      >
        <header className="mb-4 flex items-start justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-300">Learning Path</span>
          <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', difficultyClass(roadmap.difficulty))} aria-label={`Difficulty ${roadmap.difficulty}`}>
            {roadmap.difficulty}
          </span>
        </header>
        <h3 className="text-xl font-bold text-blue-900 transition-colors group-hover:text-blue-600 dark:text-blue-100 dark:group-hover:text-blue-300">{roadmap.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{roadmap.headline}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-muted px-3 py-1">{roadmap.duration}</span>
          <span className="rounded-full bg-muted px-3 py-1">{roadmap.modules} phases</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {roadmap.tags.slice(0, 4).map((tag) => (
            <SkillBadge key={tag} label={tag} />
          ))}
        </div>
        <span className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white group-hover:bg-blue-700" aria-hidden="true">
          Start Roadmap →
        </span>
      </Link>
    </article>
  );
}
