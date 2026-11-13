import type { Metadata } from "next"
import Link from "next/link"
import snapshotData from "@/data/model-economics/models.json"
import { CostCalculator } from "@/components/model-economics/CostCalculator"
import { CostMethodDialog } from "@/components/model-economics/CostMethodDialog"
import { estimateAll } from "@/lib/model-economics/estimate.mjs"
import { DEFAULT_WORKLOAD } from "@/lib/model-economics/presets.mjs"
import type { ModelEconomicsSnapshot } from "@/lib/model-economics/types"

const snapshot = snapshotData as ModelEconomicsSnapshot

const PAGE_URL = "https://www.buildnscale.dev/ai-costs"
const CHECKED = snapshot.firstPartyCheckedAt
const allDefaultRows = estimateAll(snapshot.models, DEFAULT_WORKLOAD)
const eligibleDefaultRows = allDefaultRows.filter((row) => !row.overContext)
const defaultLow = eligibleDefaultRows[0] ?? allDefaultRows[0]
const defaultHigh =
  eligibleDefaultRows[eligibleDefaultRows.length - 1] ??
  allDefaultRows[allDefaultRows.length - 1]

const FAQS = [
  {
    question: "How is AI API cost calculated?",
    answer:
      "Requests = tasks × turns × (1 + retry rate). Monthly cost = requests × (input tokens × input rate + output tokens × output rate) ÷ 1,000,000, using the model's price per million tokens.",
  },
  {
    question: "Why is my provider bill higher than this estimate?",
    answer:
      "Retries, tool calls, web search, reasoning tokens, cache writes, and storage can add cost. Tokenizers also differ, so a token estimate from another model can be off.",
  },
  {
    question: "Which model is cheapest for my workload?",
    answer:
      "The calculator ranks by estimated bill, not quality. A cheaper model may need more turns or more retries, so compare cost per completed task and check the quality reference before switching.",
  },
  {
    question: "Is an API cheaper than a chat subscription?",
    answer:
      "Only for the workload you enter. The Plan column compares your monthly plan price with the estimated API bill for interactive work; plans have usage limits and are not production quotas.",
  },
  {
    question: "How current are these prices?",
    answer: `List prices come from each provider's pricing page and were checked on ${dateLabel(CHECKED)}. They are not live: Google's Gemini 4 Carbon price doubles on December 1, 2026, and DeepSeek's shown price is the peak rate.`,
  },
  {
    question: "Is my workload uploaded or sent to a provider?",
    answer:
      "No. The calculator runs in your browser, uses no provider keys, and makes no inference calls. Shared links encode only the input numbers.",
  },
]

export const metadata: Metadata = {
  title: "AI model cost calculator — cost per task and month",
  description:
    "Estimate AI feature cost per task and month across Claude, GPT, Gemini, and DeepSeek from dated list prices. Includes cache, retry, and long-context effects.",
  keywords: [
    "AI model cost calculator",
    "LLM API pricing calculator",
    "AI cost per task",
    "AI API monthly cost",
    "cost per token calculator",
    "Claude pricing calculator",
    "GPT pricing calculator",
    "Gemini pricing calculator",
    "DeepSeek pricing",
  ],
  authors: [{ name: "Muhammad Yousaf", url: "https://www.buildnscale.dev" }],
  creator: "buildnscale.dev",
  publisher: "buildnscale.dev",
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "buildnscale.dev",
    title: "AI model cost calculator — cost per task and month",
    description:
      "Turn a workload into cost per task and monthly spend across eight models, with dated list prices and visible assumptions.",
    url: PAGE_URL,
    // The image files live in app/ai-costs/, outside this route group, so Next
    // does not auto-link them. Keep these references explicit.
    images: [
      {
        url: "/ai-costs/opengraph-image",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "AI model cost calculator — cost per task and month across Claude, GPT, Gemini, and DeepSeek",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI model cost calculator — cost per task and month",
    description:
      "Turn a workload into cost per task and monthly spend across eight models, with dated list prices and visible assumptions.",
    images: [
      {
        url: "/ai-costs/twitter-image",
        alt: "AI model cost calculator — cost per task and month across Claude, GPT, Gemini, and DeepSeek",
      },
    ],
  },
}

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 3,
})

const count = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 })

function dateLabel(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}

const checkedLabel = dateLabel(CHECKED)

// Group the reference table by publisher so it is easy to scan; it is not a
// ranking. The calculator table remains sorted by estimated cost.
const priceRows = [...snapshot.models].sort(
  (a, b) => a.publisher.localeCompare(b.publisher) || a.name.localeCompare(b.name)
)

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["WebApplication", "SoftwareApplication"],
      "@id": `${PAGE_URL}#app`,
      name: "AI Model Cost Calculator",
      url: PAGE_URL,
      description:
        "Free calculator that turns an AI workload into cost per task and monthly spend across Claude, GPT, Gemini, and DeepSeek, using dated list prices and visible assumptions.",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
      featureList: [
        "Cost per task, per 1,000 tasks, and per month",
        "Cache-hit, retry, long-context, and scheduled-price modelling",
        "Shareable workload link with no saved data",
        "Dated first-party list prices for eight models",
      ],
      dateModified: CHECKED,
      publisher: {
        "@type": "Organization",
        name: "buildnscale.dev",
        url: "https://www.buildnscale.dev",
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://www.buildnscale.dev",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "AI model cost calculator",
          item: PAGE_URL,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${PAGE_URL}#faq`,
      mainEntity: FAQS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
    {
      "@type": "Dataset",
      "@id": `${PAGE_URL}#price-snapshot`,
      name: `AI model list prices — snapshot ${CHECKED}`,
      description:
        "USD list prices per 1M tokens for eight Anthropic, OpenAI, Google, and DeepSeek models, including cache-read rates, context limits, long-context rates, and scheduled price changes.",
      url: PAGE_URL,
      creator: {
        "@type": "Organization",
        name: "buildnscale.dev",
        url: "https://www.buildnscale.dev",
      },
      isAccessibleForFree: true,
      datePublished: CHECKED,
      dateModified: CHECKED,
      temporalCoverage: CHECKED,
      keywords: [
        "AI model pricing",
        "LLM list prices",
        "token pricing",
        "Claude pricing",
        "GPT pricing",
        "Gemini pricing",
        "DeepSeek pricing",
      ],
      variableMeasured: [
        "Input price per 1M tokens",
        "Output price per 1M tokens",
        "Cache-read price per 1M tokens",
        "Context window tokens",
      ],
      citation: snapshot.sources.map((source) => source.url),
    },
  ],
}

export default function AICostsPage() {
  return (
    <main className="container-site py-16 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-5xl">
        <p className="eyebrow">MODEL ECONOMICS · OPEN BETA</p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight text-fg sm:text-4xl">
          AI model cost calculator
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          Turn an AI API workload into cost per task and per month for Claude, GPT,
          Gemini, and DeepSeek. Dated list prices, visible assumptions, no login.
        </p>

        <CostMethodDialog
          modelCount={snapshot.models.length}
          checkedLabel={checkedLabel}
          checkedISO={CHECKED}
          defaultLow={money.format(defaultLow.monthly)}
          defaultHigh={money.format(defaultHigh.monthly)}
          workload={DEFAULT_WORKLOAD}
        />

        <CostCalculator
          models={snapshot.models}
          checkedAt={checkedLabel}
          checkedISO={CHECKED}
        />

        <section className="mt-14" aria-labelledby="prices-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="prices-heading" className="font-display text-2xl font-semibold text-fg">
                List prices used
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                USD per 1M tokens from each provider, cross-checked against OpenRouter.
                Excludes taxes, batch discounts, and negotiated rates.
              </p>
            </div>
            <p className="text-xs text-tertiary">
              Checked <time dateTime={CHECKED}>{checkedLabel}</time>
            </p>
          </div>

          <div
            className="mt-5 overflow-x-auto rounded-xl border border-border bg-surface"
            role="region"
            aria-label="List prices by model"
            tabIndex={0}
          >
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <caption className="sr-only">
                List prices per million tokens by model
              </caption>
              <thead>
                <tr className="border-b border-border text-left text-2xs uppercase tracking-wider text-tertiary">
                  <th scope="col" className="px-4 py-3 font-medium">Model</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Input</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Output</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Cache read</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Context</th>
                  <th scope="col" className="px-4 py-3 font-medium">Source</th>
                </tr>
              </thead>
              <tbody>
                {priceRows.map((model) => {
                  const scheduled = model.scheduledPricing[0]
                  return (
                    <tr key={model.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 align-top">
                        <span className="font-medium text-fg">{model.name}</span>
                        <span className="mt-0.5 block text-2xs text-tertiary">
                          {model.publisher}
                        </span>
                        {model.longContext ? (
                          <span className="mt-1 block text-2xs text-tertiary">
                            Over {count.format(model.longContext.thresholdInputTokens)} input:{" "}
                            {money.format(model.longContext.pricing.input)} /{" "}
                            {money.format(model.longContext.pricing.output)}
                          </span>
                        ) : null}
                        {scheduled ? (
                          <span className="mt-1 block text-2xs text-amber">
                            From {dateLabel(scheduled.effectiveFrom)}:{" "}
                            {money.format(scheduled.pricing.input)} /{" "}
                            {money.format(scheduled.pricing.output)}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-right align-top tabular-nums text-muted">
                        {money.format(model.pricing.input)}
                      </td>
                      <td className="px-4 py-3 text-right align-top tabular-nums text-muted">
                        {money.format(model.pricing.output)}
                      </td>
                      <td className="px-4 py-3 text-right align-top tabular-nums text-muted">
                        {model.pricing.cacheRead === null
                          ? "—"
                          : money.format(model.pricing.cacheRead)}
                      </td>
                      <td className="px-4 py-3 text-right align-top tabular-nums text-tertiary">
                        {count.format(model.contextTokens)}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <a
                          href={model.priceSource.url}
                          className="text-teal no-underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {model.publisher} ↗
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-tertiary">
            DeepSeek is shown at peak rates; off-peak is half. Anthropic&apos;s newer
            tokenizer yields about 30% more tokens than Sonnet 4.6 and earlier, so older
            token estimates can understate cost. Prices change; this page does not update
            itself.
          </p>
        </section>

        <section className="mt-14" aria-labelledby="limits-heading">
          <h2 id="limits-heading" className="font-display text-2xl font-semibold text-fg">
            What this leaves out
          </h2>
          <ul className="mt-4 grid gap-x-6 gap-y-2 text-sm text-muted sm:grid-cols-2">
            {[
              "Tool calls, web search, storage, and cache writes",
              "Plan quotas, rate limits, and provider-specific caching rules",
              "Taxes, batch discounts, and negotiated enterprise rates",
              "Quality per dollar — there is no blended score here",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-tertiary">
            An estimate is not a quote. Show the assumptions when you share a budget.
          </p>
        </section>

        <section className="mt-14" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="font-display text-2xl font-semibold text-fg">
            Common questions
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {FAQS.map((item) => (
              <div key={item.question} className="rounded-xl border border-border bg-surface p-4">
                <h3 className="text-sm font-medium text-fg">{item.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 border-t border-border pt-6" aria-labelledby="sources-heading">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2
                id="sources-heading"
                className="text-2xs font-medium uppercase tracking-wider text-tertiary"
              >
                Sources
              </h2>
              <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-xs">
                {snapshot.sources.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      className="text-muted underline decoration-border underline-offset-4 hover:text-fg"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {source.name}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 max-w-2xl text-2xs leading-relaxed text-tertiary">
                {snapshot.attribution}
              </p>
            </div>
            <p className="max-w-xs text-2xs leading-relaxed text-tertiary">
              Open beta: if this is useful we will add price history; if not, we will
              remove it.{" "}
              <a
                href="https://github.com/myousafmarfani/BuildnScale/issues"
                className="text-teal no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Report a wrong price
              </a>{" "}
              or read the{" "}
              <Link href="/leaderboard/methodology" className="text-teal no-underline">
                benchmark methodology
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
