import Link from "next/link"

interface BlogCardProps {
  title: string
  excerpt: string
  slug: string
  tag: string
  date: string
  readTime: string
  featured?: boolean
}

export function BlogCard({
  title,
  excerpt,
  slug,
  tag,
  date,
  readTime,
  featured,
}: BlogCardProps) {
  if (featured) {
    return (
      <Link
        href={`/blog/${slug}`}
        className="col-span-full grid items-center gap-12 rounded-lg border border-border bg-surface p-10 md:grid-cols-[1.5fr_1fr]"
      >
        <div className="flex aspect-video items-center justify-center rounded-lg bg-surface-raised">
          <span className="font-display text-xs text-tertiary">16:9</span>
        </div>
        <div>
          <span className="font-display text-xs text-teal">{tag}</span>
          <h2 className="mt-3 text-2xl font-medium leading-tight text-fg">
            {title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">{excerpt}</p>
          <div className="mt-4 flex gap-4 font-mono text-xs text-tertiary">
            <span>{date}</span>
            <span>{readTime}</span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${slug}`} className="group flex flex-col">
      <div className="mb-5 flex aspect-video items-center justify-center rounded-lg border border-border bg-surface">
        <span className="font-display text-xs text-tertiary">16:9</span>
      </div>
      <span className="absolute bottom-3 left-3 rounded border border-border bg-bg px-2 py-0.5 text-xs text-teal">
        {tag}
      </span>
      <h3 className="text-base font-medium leading-snug text-fg transition-colors group-hover:text-teal">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{excerpt}</p>
      <div className="mt-4 flex justify-between font-mono text-xs text-tertiary">
        <span>{date}</span>
        <span>{readTime}</span>
      </div>
    </Link>
  )
}
