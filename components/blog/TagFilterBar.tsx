'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, X } from 'lucide-react';

type TagFilterBarProps = {
  tags: string[];
  activeTag: string | null;
  buildHref?: (page: number, tag?: string | null) => string;
};

const INITIAL_VISIBLE_TAGS = 4;
const SECOND_STEP_VISIBLE_TAGS = 10;

export default function TagFilterBar({ tags, activeTag, buildHref }: TagFilterBarProps) {
  const [isExpandedToTen, setIsExpandedToTen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const secondStepCount = Math.min(SECOND_STEP_VISIBLE_TAGS, tags.length);
  const visibleTags = isExpandedToTen
    ? tags.slice(0, secondStepCount)
    : tags.slice(0, INITIAL_VISIBLE_TAGS);
  const expandableCount = Math.max(0, secondStepCount - INITIAL_VISIBLE_TAGS);
  const hasMoreThanSecondStep = tags.length > SECOND_STEP_VISIBLE_TAGS;

  const chipClass =
    'text-xs px-3 py-1.5 rounded-full border font-medium transition-colors border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-500';

  const tagHref = (tag: string) => {
    const params = new URLSearchParams();
    params.set('tag', tag);
    return `/blog?${params.toString()}`;
  };

  const hrefForTag = (tag: string) =>
    typeof buildHref === 'function' ? buildHref(1, tag) : tagHref(tag);

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/blog"
          className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
            !activeTag
              ? 'bg-blue-500 border-blue-500 text-white'
              : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-500'
          }`}
        >
          All
        </Link>

        {visibleTags.map((tag) => (
          <Link
            key={tag}
            href={hrefForTag(tag)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
              activeTag === tag
                ? 'bg-blue-500 border-blue-500 text-white'
                : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-500'
            }`}
          >
            {tag}
          </Link>
        ))}

        {!isExpandedToTen && expandableCount > 0 && (
          <button
            type="button"
            onClick={() => setIsExpandedToTen(true)}
            className={`${chipClass} inline-flex items-center gap-1`}
          >
            {expandableCount} more tags
            <ChevronDown size={14} />
          </button>
        )}

        {isExpandedToTen && hasMoreThanSecondStep && (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className={`${chipClass} inline-flex items-center gap-1`}
          >
            View all tags
            <ChevronDown size={14} />
          </button>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 backdrop-blur-md px-4"
          role="dialog"
          aria-modal="true"
          aria-label="All tags"
        >
          <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold">All tags</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg border border-zinc-200 dark:border-zinc-700 p-1.5 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-100"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-1">
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/blog"
                  onClick={() => setIsModalOpen(false)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                    !activeTag
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-500'
                  }`}
                >
                  All
                </Link>
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={hrefForTag(tag)}
                    onClick={() => setIsModalOpen(false)}
                    className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                      activeTag === tag
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-500'
                    }`}
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
