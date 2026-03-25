'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

type Tab = {
  key: string;
  label: string;
};

type Props = {
  tabs: Tab[];
};

export default function ResourcesFilterBar({ tabs }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const categoryParam = params.get('category');
  const current = categoryParam && tabs.some((tab) => tab.key === categoryParam) ? categoryParam : 'all';

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

  return (
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
                ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                : 'border-blue-200 bg-white text-blue-700 hover:border-blue-400 dark:border-blue-900/50 dark:bg-zinc-900 dark:text-blue-300'
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
