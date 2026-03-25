'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import RoadmapCard from '@/components/roadmaps/RoadmapCard';
import type { RoadmapMeta } from '@/lib/roadmaps';
import { cn } from '@/lib/utils';

type Props = {
  roadmaps: RoadmapMeta[];
};

type FilterKey = 'all' | 'full-stack' | 'ai-ml' | 'devops-cloud';

const tabs: Array<{ key: FilterKey; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'full-stack', label: 'Full-Stack' },
  { key: 'ai-ml', label: 'AI & ML' },
  { key: 'devops-cloud', label: 'DevOps & Cloud' },
];

function matchesCategory(roadmap: RoadmapMeta, filter: FilterKey): boolean {
  if (filter === 'full-stack') {
    return roadmap.category === 'Full-Stack Development';
  }

  if (filter === 'ai-ml') {
    return roadmap.category === 'AI & Machine Learning';
  }

  if (filter === 'devops-cloud') {
    return roadmap.category === 'DevOps & Cloud';
  }

  return true;
}

export default function RoadmapFilterBar({ roadmaps }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const categoryParam = params.get('category');
  const current =
    categoryParam && tabs.some((tab) => tab.key === categoryParam)
      ? (categoryParam as FilterKey)
      : 'all';

  const setCategory = (next: FilterKey) => {
    const nextParams = new URLSearchParams(params.toString());
    if (next === 'all') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', next);
    }

    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const featured = useMemo(
    () => roadmaps.filter((item) => item.featured).filter((item) => matchesCategory(item, current)),
    [roadmaps, current]
  );

  const filtered = useMemo(
    () => roadmaps.filter((item) => matchesCategory(item, current)).filter((item) => !item.featured),
    [roadmaps, current]
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = current === tab.key;
          return (
            <button
              type="button"
              key={tab.key}
              onClick={() => setCategory(tab.key)}
              className={cn(
                'rounded-full border px-4 py-2 text-sm font-semibold transition-colors',
                active
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-blue-200 bg-white text-blue-700 hover:border-blue-400 dark:border-blue-900/50 dark:bg-zinc-900 dark:text-blue-300'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {featured.length === 1 && (
        <div className="translate-y-0 opacity-100 transition-all duration-300">
          <RoadmapCard roadmap={featured[0]} featured />
        </div>
      )}

      {featured.length > 1 && (
        <div className="space-y-6 transition-all duration-300 mb-12">
          {featured.map((roadmap) => (
            <RoadmapCard key={roadmap.slug} roadmap={roadmap} featured />
          ))}
        </div>
      )}

      <div className="space-y-4 transition-all duration-300">
        {filtered.map((roadmap) => (
          <RoadmapCard key={roadmap.slug} roadmap={roadmap} />
        ))}
      </div>

      {filtered.length === 0 && featured.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
          No published roadmaps in this category yet.
        </div>
      )}
    </section>
  );
}
