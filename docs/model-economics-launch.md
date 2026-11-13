# Model economics: launch notes

Status: draft. Nothing here has been posted. Re-check the prices and the page on
the day of posting, and read each community's current rules first.

## Pre-flight

- [ ] Run `npm run models:sync` and confirm zero cross-check warnings.
- [ ] Open `/ai-costs` on a narrow screen. The results table scrolls sideways; the
      inputs and summary cards must not overflow.
- [ ] Change every input, use all three presets, reset, and reload a shared URL.
- [ ] Confirm the email form returns success and the address appears in Buttondown
      as unconfirmed (the list uses double opt-in).
- [ ] Confirm `model_economics_*` events appear in GA4 Realtime. They carry no values.
- [ ] Check that the roadmap and changelog both describe the page as an open beta.
- [ ] Read the rules for each community. If promotion is restricted, post the math
      without the link and offer it in a comment.

## Numbers to use

Default workload in the calculator: 1,000 tasks/month, 3 turns per task, 8,000
input tokens and 700 output tokens per request, no cache, 2% retries. That is
3,060 requests/month.

| Model | Monthly estimate |
| --- | --- |
| Claude Haiku 5.5 | $3.52 |
| DeepSeek V4.1 Flash | $9.91 |
| GPT-6.1 Terra | $35.19 |
| Gemini 4 Hydrogen | $52.79 |
| Claude Sonnet 5.5 | $70.38 |
| Gemini 4 Carbon | $70.38 |
| Claude Fable 5.2 | $281.52 |
| GPT-6 Astra | $351.90 |

At a 60% cache hit rate, Claude Sonnet 5.5 falls from about $70.38 to $42.47 on
the same workload. Say "about" and show the assumption; do not present a single
number as a quote.

## r/ClaudeAI

Title: I priced the same workload across Claude, GPT, Gemini, and DeepSeek. The
spread is wider than the benchmark spread.

Body:

> I keep seeing "which model is best" threads and "why is my bill so high"
> threads, and they rarely use the same units. So I modeled one workload and
> priced it across eight models.
>
> The workload: 1,000 tasks/month, 3 model calls per task, 8,000 input tokens per
> call (system prompt + history), 700 output tokens, 2% retries. About 3,060
> requests/month.
>
> At list prices checked on November 13:
>
> - Claude Haiku 5.5: $3.52/month
> - Claude Sonnet 5.5: $70.38/month
> - Claude Fable 5.2: $281.52/month
> - DeepSeek V4.1 Flash: $9.91/month
> - GPT-6 Astra: $351.90/month
>
> Two things that surprised me. Turns multiply requests, so an agent that makes
> eight calls per task costs eight times what the per-call price suggests. And
> Claude's newer tokenizer produces roughly 30% more tokens for the same text,
> which quietly raises every estimate carried over from an older model.
>
> I built a no-login calculator with the assumptions visible and the price date on
> the page: [link]. It is mine, it has no affiliate links, and it does not ask for
> an account. I would rather find out the model is wrong than defend it. What
> workload shape should I add?

## r/LocalLLaMA

Title: Benchmarks be damned: the same workload costs $3.52 or $351.90/month
depending on the model

Body:

> Not another leaderboard. I took one workload shape and priced it across eight
> models at list prices: 3,060 requests/month, 8k input and 700 output tokens per
> request, 2% retries.
>
> - Claude Haiku 5.5: $3.52
> - DeepSeek V4.1 Flash: $9.91
> - GPT-6.1 Terra: $35.19
> - Gemini 4 Hydrogen: $52.79
> - Claude Sonnet 5.5 / Gemini 4 Carbon: $70.38
> - Claude Fable 5.2: $281.52
> - GPT-6 Astra: $351.90
>
> The interesting part is not the ranking. It is how much the shape changes the
> answer. DeepSeek's peak price is double its off-peak price. Claude Haiku 5.5
> charges 5x once a single prompt passes 100k tokens. GPT-6 models jump to a
> long-context rate above 272k. Gemini 4 Carbon doubles on December 1. A single
> "cost per million tokens" number hides all of that.
>
> I put the math and the dated prices in a calculator: [link]. No login, no
> upload, no inference. It is a validation build, so tell me what it gets wrong,
> especially the cache-write and tool-call costs I left out.

## r/ExperiencedDevs

This sub is less tolerant of launch posts. Ask the question first; do not put the
link in the body.

Title: How do you estimate the monthly cost of an AI feature before you commit?

Body:

> We are getting better at evaluating output quality and worse at predicting the
> bill. The estimate that matters is not price per million tokens; it is requests
> per task, retries, context growth, cache behavior, and what the provider does at
> long context.
>
> A simple version that has held up for me:
>
> `tasks/month × turns/task × (1 + retry rate) × (input tokens × input rate + output tokens × output rate)`
>
> Then check the edge cases: cache reads vs writes, prompts over the long-context
> threshold, peak/off-peak pricing, and tokenizer changes between model
> generations.
>
> How do you do this in practice? Do you use provider calculators, a spreadsheet,
> or last month's invoice? I can share the model I used in the comments if it is
> useful; I am not trying to drop a link in the post.

If asked, reply with the link and disclose that it is yours.

## Show HN

Title: Show HN: AI model cost calculator with dated list prices, no login

Body:

> I built a calculator that turns a workload into cost per task and per month
> across Claude, GPT, Gemini, and DeepSeek.
>
> Most cost pages answer "what is the price per million tokens?" That is not the
> number that decides whether a feature ships. The number is requests per task,
> retries, context growth, cache hits, and long-context thresholds.
>
> The page shows the assumptions, the source for each price, and the date the
> prices were checked. It handles Claude Haiku's 100k long-context step, the GPT-6
> 272k step, DeepSeek's peak/off-peak pricing, and Gemini 4 Carbon's December 1
> increase. It does not upload logs, call a provider, or ask for an account.
>
> What it does not do: model tool fees, cache writes, storage, taxes, or plan
> quotas. It is a validation build, not a finished product. I would value a
> correction more than a compliment.
>
> [link]

## Reply template for existing threads

> For that workload the math is roughly: {requests} requests × ({input} tokens ×
> ${rate}/1M + {output} tokens × ${rate}/1M) = about ${monthly}/month at
> {model}'s list price. That assumes {turns} turns per task, {retry}% retries, and
> no cache hits; cache reads and long-context pricing can move it a lot.
>
> I put the source-dated version here if it helps: [link]. Disclosure: I built it.

Only reply where the calculation answers the actual question. Do not paste the
same reply into every cost thread.

## What not to do

- Do not claim live prices. The page says "checked November 13, 2026" for a reason.
- Do not claim a model is best. The quality column is one Arena board, with a caveat.
- Do not compare a chat plan to production API traffic. The page warns about this.
- Do not use alt accounts, ask for upvotes, DM people, or post the same text in
  several subs on the same day.
- Do not hide that the page is yours.
- Do not argue with a correction. Fix the snapshot and note the change.

## Measurement

Log the channel and date for each post. After four weeks, compare:

- Unique visitors and `model_economics_view`.
- `model_economics_calculate` / view (target 30%).
- `model_economics_share`.
- `model_economics_email_capture` (target 100) and explicit "I would use this"
  comments (target 20).
- Five interviews, including two freelancers quoting AI work.
- Returning visitors within seven days (target 10%).

If traffic is high and completion is low, the problem may be real but the tool is
not the answer. If traffic is low, the distribution hypothesis is wrong before the
product hypothesis is.
