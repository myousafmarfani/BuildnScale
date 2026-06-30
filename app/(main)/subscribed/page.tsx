import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Subscribed \u2014 BuildNScale",
  robots: { index: false },
}

export default function SubscribedPage() {
  return (
    <div className="container-site section-pad flex flex-col items-center justify-center text-center">
      <h1 className="font-display text-hero font-bold tracking-tighter text-fg">
        You&rsquo;re confirmed!
      </h1>
      <p className="mt-4 text-lg text-muted max-w-md leading-relaxed">
        Welcome to the build log. One email a week, technical lessons and new
        tool releases &mdash; nothing else.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block bg-teal text-bg text-sm font-semibold px-6 py-3 rounded-md hover:bg-teal-hover transition-colors"
      >
        Back to homepage
      </Link>
    </div>
  )
}
