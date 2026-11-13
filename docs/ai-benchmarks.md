# AI leaderboard: data and rollout

## Current coverage

The default leaderboard uses the official `lmarena-ai/leaderboard-dataset` on
Hugging Face, licensed CC BY 4.0. No Arena or Artificial Analysis API key is needed.

- `/leaderboard`: latest overall `text_style_control` board.
- `/leaderboard/coding`: latest overall `webdev` board. The route name is kept
  for compatibility, but the interface labels it **Web development** to avoid
  implying a coding pass rate.
- `/leaderboard/agents`: latest overall aggregate `agent` board.
- `/models` and `/compare`: Arena evaluated labels by default.
- `/leaderboard/archive`: historical EvalPlus results, also accessible explicitly
  with `?source=evalplus`. Historical model URLs remain accessible and noindex.
- `/leaderboard/methodology` and `/leaderboard/changelog`: interpretation and history.
- `/leaderboard/value`: explicit empty state until a permitted pricing feed exists.

These are preference ratings and agent IPS scores, not pass rates or a universal
benchmark score. We do not claim every released model is covered or every benchmark
is included. Source publication date and successful check time are separate.

This release is deliberately **Arena-first**. Objective coding suites such as
SWE-bench Verified or LiveCodeBench are not included and must not be inferred from
the web development board. Adding them requires a permitted, attributable source
and a separate import path.

## Deploy this update (existing BuildnScale database)

1. Review and merge PR #9 after preview checks pass. Vercel deploys the branch/main
   normally. The bundled Arena snapshot immediately provides dated results; it is
   not a continuing live feed by itself.
2. Keep the existing production `DATABASE_URL`. If `BenchmarkSnapshot` already
   exists, no migration is required. If it is missing, apply the reviewed additive
   `supabase/migrations/20261026_benchmark_snapshots.sql` once. Do not create a new
   Supabase project or replace the existing database.
3. Set a strong `CRON_SECRET` in Vercel Production if not already configured, and
   redeploy after any environment change. Never put its value in GitHub code or chat.
4. In GitHub repository **Settings → Secrets and variables → Actions**, configure:
   - Secret `CRON_SECRET`: exactly the same value as Vercel. The workflow fails
     loudly if this is missing.
   - Variable `BNS_BENCHMARK_IMPORTS_ENABLED`: `true`. Scheduled runs fail loudly
     when this is missing; manual dispatch still attempts the import.
   - Leave `BNS_AA_IMPORT_ENABLED` unset or `false`.
5. Open **Actions → Refresh benchmark snapshots → Run workflow**, branch `main`,
   after production deployment finishes. It POSTs the authenticated Arena refresh.
6. Check workflow success, `/leaderboard/changelog`, and **Last successful check**
   on `/leaderboard`. Inspect all three category dates and confidence bounds.
   A green workflow is the verification of the deployed DB write path; a local
   source-fetch test alone cannot verify production credentials or persistence.
7. Confirm `GET /api/benchmarks/freshness` returns `"storage": "database"` and
   `"checkOverdue": false`. The hourly **Benchmark freshness alert** workflow checks
   the same endpoint and fails if production serves the bundled fallback or has no
   successful check in more than eight hours.

The workflow targets every four hours at minute 25 UTC (Pakistan: approximately
01:25, 05:25, 09:25, 13:25, 17:25, 21:25). GitHub schedules can be delayed and may
be disabled after prolonged repository inactivity; check Actions if freshness is
overdue. Import failures fail the workflow and retain the previous publication.
GitHub notification preferences control failure emails.

Do not enable `AA_PUBLIC_DISPLAY_ENABLED` for this free Arena integration. It is
only for a separately licensed optional Artificial Analysis source. Its free API
key alone does not grant public redistribution rights.

## Import and storage design

`lib/benchmarks/arena.mjs` discovers the current dataset revision and verifies its
`cc-by-4.0` license metadata. It reads all selected Parquet shards directly from
immutable revision URLs, checks shard completeness, selects the latest overall
board per subset, and normalizes the data. The dataset viewer is not used because
its cache could lag or mix revisions across paginated requests. `hyparquet` parses
the small files server-side; no new evaluation inference is run.

Full precision values, published source ranks, confidence bounds, votes or
observations/sessions, and each board's publication date are retained. Missing
counts and organisations remain unknown. Agent scores may be negative. Exact
organisation + evaluated label joins boards; no fuzzy API ID/name matching occurs.
Duplicate labels within one board are retained as separate records marked with
the published source rank. Configurations are not guessed, and their internal IDs
can change if an ambiguous rank changes.

`BenchmarkSnapshot` stores immutable payloads under unique `(source, revision)`.
A successful unchanged check updates the row's `retrievedAt` as the last successful
check, without changing its original JSON payload/import timestamp. New revisions
create new rows. Source/schema/license errors, per-board coverage drops over 25%,
or regressed publication dates stop publication. Suspicious source corrections
require an operator to inspect and deliberately adjust the relevant guard; do not
silently delete stored history to bypass it.

One snapshot contains all three boards and is saved only after every board passes.
A successful import invalidates the data cache and public routes immediately. Reads
cache for one hour; storage failure uses the bundled Arena snapshot with its original
timestamps. The interface and update history label the storage path (`Stored database
snapshot` or `Bundled fallback`). Notices flag more than eight hours without a
successful check and board publication older than seven days. A recent check does
not relabel old published measurements as fresh.

Refresh endpoint: `POST /api/benchmarks/refresh?source=arena`, with server-side
`Authorization: Bearer <CRON_SECRET>`. GET cannot mutate data. EvalPlus and the
permission-gated AA adapter remain available for explicit operator imports.
`GET /api/benchmarks/freshness` is a read-only operational endpoint that reports the
serving storage path, revision, timestamps, and freshness booleans without exposing
credentials.

The hourly **Benchmark freshness alert** workflow checks both the bundled fallback
age (`node scripts/check-benchmark-freshness.mjs --max-age-days 7 --strict`) and the
production endpoint. It fails if the fallback is stale, production serves bundled
data, or no successful check has occurred in the last eight hours.

Regenerate the bundled fallback with `npm run benchmarks:arena`, inspect the diff,
and commit it. `npm run benchmarks:check` warns if the fallback is older than seven
days; use `npm run benchmarks:check:strict` to fail in CI. This downloads the source
at an immutable revision; no credentials are needed. It does not write the
production database.

## Validation

Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`,
`npm run benchmarks:check:strict`, and `npm run test:benchmarks` (requires a
Playwright Chromium executable). The scheduled freshness workflow also runs the
strict fallback check and verifies the production endpoint. Unit coverage includes
signed scores, published ranks, confidence bounds, duplicate labels, absent metadata,
source-license refusal, stale checks, source selection, and optional AA publication
gating. Browser coverage includes all current boards, model evidence, comparisons,
archive filtering, mobile layouts, metadata/sitemap, and unauthenticated refresh
rejection.

## New empty database only

The existing Supabase setup already has the eight required tables. Do not rerun
bootstrap SQL there. For a completely new empty installation only, run
`supabase/bootstrap/buildnscale.sql` once in Supabase SQL Editor. It creates the
application tables/indexes/foreign keys, enables RLS, revokes browser-role access,
and aborts if any application table exists. Prisma uses server-side credentials;
Supabase Auth/Data API are not required. This does not recover old user data.

For an established installation missing only `BenchmarkSnapshot`, use the reviewed
additive `supabase/migrations/20261026_benchmark_snapshots.sql` instead. Do not use
`prisma migrate deploy` without first baselining the existing database.

## Attribution

Arena dataset: https://huggingface.co/datasets/lmarena-ai/leaderboard-dataset
License: https://creativecommons.org/licenses/by/4.0/
Dataset announcement: https://arena.ai/blog/arena-leaderboard-dataset

Visible notices credit Arena / lmarena-ai, link the immutable source and license,
and disclose filtering/normalization and that evaluations were not rerun. No
endorsement is implied. The imported data is CC BY 4.0; the application MIT license
does not replace upstream data licenses. Do not apply extra restrictions to this
open data. Model weights, third-party logos, and benchmark task text are not bundled.

Historical EvalPlus JSON is Apache-2.0; its original source and license remain in
`data/benchmarks/`. The source was last updated 26 December 2024. Archived pass@1
percentages are never substituted for current Arena ratings.
