# Model Economics: validation plan

Status: smoke test live at `/ai-costs` as an open beta. It is not in the
eight-tool catalog and has no dated roadmap commitment. Publish a plan only if the
thresholds below are met.

## Hypothesis

Developers, technical founders, and freelancers building AI features will use a
source-dated calculator that turns a real workload into cost per task and monthly
cost, then compares models and subscription plans. Existing leaderboards answer
"which model ranks well?" but not "what will this cost me, and is the quality
difference worth it?"

Evidence for the problem is in the November 2026 research notes: recurring
complaints about cost per task, subscription-vs-API confusion, context re-reads,
and model routing that costs more than expected. The pain is tied to money, which
makes willingness to use easier to test than a generic productivity tool.

## Primary user

1. A developer building an AI feature who needs a monthly cost estimate.
2. A freelancer quoting an AI feature to a client who needs a defensible number.
3. A technical founder choosing between API usage and a subscription plan.

## Job to be done

"Before I commit to a model, plan, or client quote, show me the cost per task and
per month for my workload, with the quality trade-off and the assumptions visible."

## Smoke-test scope

A no-login page. No database writes. No provider API keys. No inference.

### Inputs

- Requests or tasks per month.
- Average input tokens per request.
- Average output tokens per request.
- Turns per task (for agent-style workloads).
- Context re-read factor or cache-hit rate.
- Retry/failure rate.
- Optional: plan price the user is already paying.

### Outputs

- Cost per task.
- Monthly cost.
- Cost per 1,000 tasks.
- A ranked table of 6-8 models with input, output, cache-read, and context prices.
- Subscription break-even: "At this usage, API cost is $X/month; your plan at $Y/month
  is cheaper/expensive by $Z." The user supplies the plan price; we do not claim
  provider quotas.
- A visible assumptions panel and source date.
- A shareable URL that encodes inputs.
- A link to the relevant leaderboard board for quality context, with the existing
  uncertainty caveat. No blended quality score.

### Explicitly out of scope

- Automatic invoice or usage-log upload.
- Provider API integration or live price fetching at request time.
- Team collaboration, saved accounts, alerts, or routing recommendations.
- Running evaluations or claiming a model is "best" for a task.
- Subscription quota claims or affiliate-driven rankings.

## Data source

The checked-in snapshot uses publisher list prices as the source of truth, because
first-party pages expose scheduled changes and long-context rules that an
aggregator can miss. OpenRouter's public model list (`/api/v1/models`) is a
cross-check only. The refresh script prints a warning when the two disagree and
keeps the first-party value. Do not silently average prices.

The snapshot records the retrieval timestamp, the first-party check date, and a
source URL per model. It also records long-context thresholds, scheduled price
changes, and model-specific notes. Gemini 4 Carbon's December 1, 2026 increase is
shown but not blended into the current price; the calculator has an opt-in toggle.

Refresh with `npm run models:sync`. The script is manual and never runs in the
request path.

Prices are list prices, not quotes. The page must say this and show the source date.
Do not add a model unless its price and context are both available.

## Routes and components

- `app/(main)/ai-costs/page.tsx` — server page, metadata, calculator, price table,
  FAQ, and JSON-LD (`WebApplication`, `BreadcrumbList`, `FAQPage`, `Dataset`).
- `components/model-economics/CostMethodDialog.tsx` — native `<dialog>` for the
  dated facts, default workload range, and the cost-per-task method. The trigger
  button keeps that detail out of the hero without removing it from the HTML.
- `app/ai-costs/opengraph-image.tsx` and `twitter-image.tsx` — page-specific social
  cards. They live outside the `(main)` route group because Next 16 appends a hash
  suffix to metadata image routes inside route groups.
- `components/model-economics/CostCalculator.tsx` — client inputs and results.
- `lib/model-economics/estimate.mjs` — pure cost math, tested without a browser.
- `data/model-economics/models.json` — source-dated model snapshot.
- `scripts/sync-model-prices.mjs` — manual refresh only; never runs in the request
  path.
- `tests/model-economics.test.mjs` — cache, retry, long-context, scheduled-price,
  clamping, and snapshot-integrity checks.
- `public/llms.txt` — concise site summary, key URLs, and calculator facts for
  answer engines and agents.
- `app/robots.ts` — allows search and assistant crawlers (`GPTBot`,
  `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`, `CCBot`, and others); `/api/` and
  `/dashboard` stay disallowed.

The page appears in the main navigation with a Beta badge, but it stays out of
the eight-tool catalog until the smoke test is accepted. Link it from the
leaderboard and model pages only after the first review.

## Discoverability

The page targets developers searching for an AI or LLM API cost calculator. Keep
one `h1`, dated prices in the HTML, and answers that stand alone when quoted.

- Metadata: canonical `/ai-costs`, OpenGraph and Twitter cards with a page-specific
  1200×630 image, keywords, and `max-snippet: -1` for Google.
- Structured data: one `@graph` with `WebApplication`/`SoftwareApplication`,
  `BreadcrumbList`, `FAQPage` matching the visible FAQ, and a `Dataset` for the
  dated price snapshot.
- Crawlers: `public/llms.txt` plus explicit allowances for the major assistant and
  search crawlers. Machine-readable price facts stay in the server-rendered table
  and the `Dataset` description; do not hide them behind a client-only view.
- If the FAQ, prices, or model list change, update the JSON-LD in the same edit so
  visible copy and structured data cannot drift.

## Measurement

Privacy-friendly event tracking is live through the existing Google Analytics
tag:

- `model_economics_view` — once per session.
- `model_economics_calculate` — once per session, 1.2 seconds after the first
  valid input change or preset.
- `model_economics_share`
- `model_economics_email_capture`

Do not capture token inputs, URLs, or any text that could identify a user's
workload. Only event names are sent. The page says this in plain language.

### Success thresholds after four weeks

- 1,000 unique visitors from at least three honest community posts.
- 30% of visitors complete a calculation.
- 100 email captures or 20 explicit "I would use this" comments.
- 5 user interviews, including at least 2 freelancers quoting AI work.
- At least 10% of visitors return within seven days.

If traffic is high but completion or email capture is low, the problem is real but
the tool is not the answer. If traffic is low, the distribution hypothesis is wrong,
not necessarily the product.

## Launch plan

1. Publish a short methodology post: "What a model actually costs per task."
2. Share the calculator in `r/ClaudeAI`, `r/LocalLLaMA`, and `r/ExperiencedDevs`
   only where the community rules allow it. Lead with the math, not the product.
3. One Show HN post after the first feedback round.
4. Reply to existing cost threads with a relevant calculation, not a link drop.
5. Interview five people who used it, including at least two who did not.

## Risks

- **Price drift:** snapshots go stale. Mitigate with a visible date and a manual
  refresh script; do not imply live pricing.
- **False precision:** token estimates are guesses. Show ranges and assumptions,
  not a single authoritative number.
- **Model mapping:** provider IDs and Arena labels do not join cleanly. Start with
  a small curated mapping and leave quality blank when uncertain.
- **Competition:** Artificial Analysis, OpenRouter, and several calculators already
  exist. Differentiate on workload modeling, subscription break-even, visible
  assumptions, and privacy — not on having the longest model list.
- **Trust:** a calculator that is wrong about a bill is worse than no calculator.
  Cross-check first-party prices and publish corrections.

## Decision rule

Build a v2 only if the smoke test clears the thresholds and at least five
interviews confirm the same job: estimating cost before committing to a model,
plan, or client quote. Otherwise, keep the page as a small reference tool or remove
it.

## Resolved for the smoke test

1. First-party list prices are the source; OpenRouter is a cross-check.
2. Subscription break-even is included, with an explicit warning that plans are
   for interactive use and are not production quotas.
3. The first audience is developers building AI features. Freelancers quoting AI
   work are the second audience for interviews, not the launch target.

## Still open

1. When does the page earn a link from the leaderboard and model pages? Proposal:
   after the first review round, not before.
2. How often should prices be refreshed? Proposal: monthly, plus a manual refresh
   when a publisher announces a change. The visible date matters more than a
   perfectly current number.
