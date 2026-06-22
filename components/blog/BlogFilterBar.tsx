'use client'

export const BLOG_CATEGORIES = ['All', 'Productivity', 'Tools', 'Freelancing', 'Indie Dev']

interface BlogFilterBarProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function BlogFilterBar({ activeCategory, onCategoryChange }: BlogFilterBarProps) {
  return (
    <div className="sticky top-[52px] z-20 border-b border-border bg-bg">
      <div className="mx-auto flex max-w-[1000px] items-center px-5 py-2.5">
        <div className="flex gap-2 scrollbar-x">
          {BLOG_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`rounded-full px-3 py-1.5 text-xs transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-teal font-medium text-bg'
                  : 'border border-border bg-raised text-muted hover:text-fg'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
