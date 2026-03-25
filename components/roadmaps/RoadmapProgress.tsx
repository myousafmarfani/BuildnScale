'use client';

import { useEffect, useMemo, useState } from 'react';

type Props = {
  slug: string;
  totalPhases: number;
};

type SavedProgress = {
  completedPhases: number[];
};

function keyFor(slug: string) {
  return `roadmap_progress_${slug}`;
}

export default function RoadmapProgress({ slug, totalPhases }: Props) {
  const [completedPhases, setCompletedPhases] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(keyFor(slug));
      if (raw) {
        const parsed = JSON.parse(raw) as SavedProgress;
        if (Array.isArray(parsed.completedPhases)) {
          setCompletedPhases(
            parsed.completedPhases
              .filter((n) => Number.isInteger(n) && n >= 1 && n <= totalPhases)
              .sort((a, b) => a - b)
          );
        }
      }
    } catch {
      setCompletedPhases([]);
    } finally {
      setHydrated(true);
    }
  }, [slug, totalPhases]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    const payload: SavedProgress = { completedPhases };
    localStorage.setItem(keyFor(slug), JSON.stringify(payload));
  }, [slug, completedPhases, hydrated]);

  const completionPercent =
    totalPhases > 0 ? Math.round((completedPhases.length / totalPhases) * 100) : 0;
  const allComplete = totalPhases > 0 && completedPhases.length === totalPhases;
  const currentPhase = useMemo<number | null>(() => {
    for (let i = 1; i <= totalPhases; i += 1) {
      if (!completedPhases.includes(i)) {
        return i;
      }
    }
    return null;
  }, [completedPhases, totalPhases]);

  const togglePhase = (phase: number) => {
    setCompletedPhases((prev) => {
      if (prev.includes(phase)) {
        return prev.filter((item) => item !== phase);
      }
      return [...prev, phase].sort((a, b) => a - b);
    });
  };

  const reset = () => {
    if (!window.confirm('Reset all progress for this roadmap?')) {
      return;
    }

    setCompletedPhases([]);
    window.localStorage.removeItem(keyFor(slug));
  };

  if (!hydrated) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-2 rounded-full bg-muted" />
        <div className="h-4 w-48 rounded bg-muted" />
        <div className="flex gap-2">
          {Array.from({ length: totalPhases }).map((_, i) => (
            <div key={i} className="h-8 w-8 rounded-full bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-4 rounded-xl border border-border bg-card p-4">
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            allComplete
              ? 'bg-green-500 shadow-[0_0_16px_rgba(34,197,94,0.7)] animate-[pulse_900ms_ease-in-out_1]'
              : 'bg-primary'
          }`}
          style={{ width: `${(completedPhases.length / totalPhases) * 100}%` }}
        />
      </div>

      {allComplete ? (
        <p className="text-sm font-medium text-green-600 dark:text-green-400">All phases complete.</p>
      ) : (
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {completedPhases.length} of {totalPhases} phases completed · {completionPercent}%
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: totalPhases }, (_, idx) => idx + 1).map((phase) => {
          const isCompleted = completedPhases.includes(phase);
          const isCurrent = currentPhase === phase;

          let buttonClass =
            'h-8 w-8 rounded-full flex items-center justify-center text-xs transition-colors';

          if (isCompleted) {
            buttonClass +=
              ' bg-green-500 text-white font-bold';
          } else if (isCurrent) {
            buttonClass +=
              ' ring-2 ring-primary ring-offset-2 ring-offset-background bg-background text-primary font-medium animate-pulse';
          } else {
            buttonClass += ' bg-muted text-muted-foreground';
          }

          return (
            <button
              key={phase}
              type="button"
              onClick={() => togglePhase(phase)}
              aria-label={`${isCompleted ? 'Unmark' : 'Mark'} phase ${phase} as ${
                isCompleted ? 'incomplete' : 'complete'
              }`}
              className={buttonClass}
            >
              {isCompleted ? '✓' : phase}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={reset}
        className="mt-2 block cursor-pointer text-xs text-muted-foreground underline hover:text-destructive"
      >
        Reset progress
      </button>
    </section>
  );
}
