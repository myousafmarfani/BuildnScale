import type { Metadata } from "next"
import Link from "next/link"
import { breadcrumbJsonLd } from "@/lib/json-ld"

export const metadata: Metadata = {
  title: "Write for Us — buildnscale.dev",
  description:
    "Contribute to BuildnScale. Share your engineering tactics, productivity systems, and AI tooling lessons with developers who ship.",
  openGraph: {
    title: "Write for Us — buildnscale.dev",
    description:
      "Contribute to BuildnScale. Share your engineering tactics, productivity systems, and AI tooling lessons with developers who ship.",
    url: "https://www.buildnscale.dev/write-for-us",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    title: "Write for Us — buildnscale.dev",
    description:
      "Contribute to BuildnScale. Share your engineering tactics, productivity systems, and AI tooling lessons with developers who ship.",
    images: ["/twitter-image"],
  },
  robots: { index: true, follow: true },
}

const guidelines = [
  "1,200–2,500 words with practical takeaways",
  "Code snippets, screenshots, or real examples encouraged",
  "No promotional fluff — readers come for substance",
  "AI tools welcome — just make sure the thinking is yours",
  "Include a short bio (2–3 lines) and links you'd like to share",
]

export default function WriteForUsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: "Home", url: "https://www.buildnscale.dev" },
            { name: "Write for Us", url: "https://www.buildnscale.dev/write-for-us" },
          ]))
        }}
      />
      <Link
        href="/"
        className="font-display mx-auto mb-12 block w-fit text-base font-semibold text-fg no-underline"
        tabIndex={-1}
      >
        build<span className="text-teal">n</span>scale
      </Link>

      <h1 className="font-display text-3xl font-semibold text-fg sm:text-4xl">
        Write for Us
      </h1>
      <p className="mt-3 text-[17px] text-muted leading-relaxed">
        BuildnScale is read by developers who care about shipping, productivity,
        and the craft of building tools. If you have hard-won tactics, honest
        retrospectives, or a unique take on engineering — we want to publish it.
      </p>

      <section className="mt-14">
        <h2 className="font-display text-xl font-semibold text-fg">
          What we cover
        </h2>
        <p className="mt-2 text-sm text-tertiary leading-relaxed">
          We publish across <strong className="text-fg">AI & LLMs</strong>,{" "}
          <strong className="text-fg">developer productivity</strong>,{" "}
          <strong className="text-fg">engineering culture</strong>,{" "}
          <strong className="text-fg">open-source tooling</strong>, and
          anything at the intersection of building and shipping. If it
          helps developers think clearer or ship faster — it fits here.
        </p>
      </section>

      <section className="mt-14 border border-border rounded-xl p-6">
        <h2 className="font-display text-lg font-semibold text-fg">
          Guidelines
        </h2>
        <ul className="mt-4 space-y-2.5">
          {guidelines.map((g) => (
            <li
              key={g}
              className="flex items-start gap-3 text-sm text-muted leading-relaxed"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal/60" />
              {g}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10 flex flex-col items-center rounded-xl border border-border p-8 text-center">
        <h2 className="font-display text-lg font-semibold text-fg">
          Ready to contribute?
        </h2>
        <p className="mt-2 text-sm text-tertiary max-w-sm">
          Send your pitch or draft to{" "}
          <a
            href="mailto:hello@buildnscale.dev"
            className="text-teal no-underline hover:underline"
          >
            hello@buildnscale.dev
          </a>
          . We review every submission within a week and will work with you on
          edits.
        </p>
        <a
          href="mailto:hello@buildnscale.dev"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-teal px-8 text-sm font-medium text-bg transition-all hover:brightness-110"
        >
          Submit your pitch →
        </a>
      </section>

      <p className="mt-10 text-center text-sm text-tertiary">
        Have questions?{" "}
        <a
          href="mailto:hello@buildnscale.dev"
          className="text-teal no-underline hover:underline"
        >
          hello@buildnscale.dev
        </a>
      </p>
    </main>
  )
}
