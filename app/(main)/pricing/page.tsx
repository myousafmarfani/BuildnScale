import Link from "next/link"

export default function PricingPage() {
  return (
    <section className="px-5 section-pad text-center">
      <div className="mx-auto max-w-[600px]">
        <span className="mb-3 block font-display text-[11px] uppercase tracking-[0.12em] text-teal">
          PRICING
        </span>
        <h1 className="font-display text-hero font-bold tracking-[-0.03em] text-fg">
          Everything is free.
        </h1>
        <p className="mt-3 text-[17px] text-muted">
          All tools, all features, no upgrade needed. No credit card. No limits.
        </p>
        <Link
          href="/tools/daily-planner"
          className="mt-8 inline-flex h-11 items-center gap-2 rounded-md bg-teal px-8 text-sm font-medium text-bg transition-all hover:brightness-110"
        >
          Open Daily Planner →
        </Link>
      </div>
    </section>
  )
}
