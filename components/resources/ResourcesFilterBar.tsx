'use client';

import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = {
  key: string;
  label: string;
};

type Props = {
  tabs: Tab[];
};

const MAX_VISIBLE_TABS = 25;

export default function ResourcesFilterBar({ tabs }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const categoryParam = params.get('category');
  const current = categoryParam && tabs.some((tab) => tab.key === categoryParam) ? categoryParam : 'all';
  const allTab = tabs.find((tab) => tab.key === 'all');
  const categoryTabs = tabs.filter((tab) => tab.key !== 'all');
  const visibleTabs = categoryTabs.slice(0, MAX_VISIBLE_TABS);
  const hiddenTabs = categoryTabs.slice(MAX_VISIBLE_TABS);

  const setCategory = (next: string) => {
    const nextParams = new URLSearchParams(params.toString());
    if (next === 'all') {
      nextParams.delete('category');
    } else {
      nextParams.set('category', next);
    }

    const query = nextParams.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const baseButtonClass =
    'rounded-full border px-4 py-2 text-sm font-semibold transition-colors';

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {allTab && (
          <button
            type="button"
            onClick={() => setCategory(allTab.key)}
            className={cn(
              baseButtonClass,
              current === allTab.key
                ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                : 'border-blue-200 bg-white text-blue-700 hover:border-blue-400 dark:border-blue-900/50 dark:bg-zinc-900 dark:text-blue-300'
            )}
          >
            {allTab.label}
          </button>
        )}

        {visibleTabs.map((tab) => {
          const active = current === tab.key;

          return (
            <button
              type="button"
              key={tab.key}
              onClick={() => setCategory(tab.key)}
              className={cn(
                baseButtonClass,
                active
                  ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                  : 'border-blue-200 bg-white text-blue-700 hover:border-blue-400 dark:border-blue-900/50 dark:bg-zinc-900 dark:text-blue-300'
              )}
            >
              {tab.label}
            </button>
          );
        })}

        {hiddenTabs.length > 0 && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className={cn(
              baseButtonClass,
              'inline-flex items-center gap-1 border-blue-200 bg-white text-blue-700 hover:border-blue-400 dark:border-blue-900/50 dark:bg-zinc-900 dark:text-blue-300'
            )}
          >
            View all categories
            <ChevronDown size={15} />
          </button>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="All categories"
        >
          <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold">All categories</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg border border-zinc-200 p-1.5 text-zinc-500 hover:text-zinc-800 dark:border-zinc-700 dark:hover:text-zinc-100"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-1">
              <div className="flex flex-wrap gap-2">
                {allTab && (
                  <button
                    type="button"
                    onClick={() => {
                      setCategory(allTab.key);
                      setIsModalOpen(false);
                    }}
                    className={cn(
                      baseButtonClass,
                      current === allTab.key
                        ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                        : 'border-blue-200 bg-white text-blue-700 hover:border-blue-400 dark:border-blue-900/50 dark:bg-zinc-900 dark:text-blue-300'
                    )}
                  >
                    {allTab.label}
                  </button>
                )}

                {categoryTabs.map((tab) => (
                  <button
                    type="button"
                    key={tab.key}
                    onClick={() => {
                      setCategory(tab.key);
                      setIsModalOpen(false);
                    }}
                    className={cn(
                      baseButtonClass,
                      current === tab.key
                        ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                        : 'border-blue-200 bg-white text-blue-700 hover:border-blue-400 dark:border-blue-900/50 dark:bg-zinc-900 dark:text-blue-300'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
