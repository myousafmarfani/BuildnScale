# Current model coverage rollout

The main `/leaderboard`, `/leaderboard/coding`, `/models`, and default comparison
picker now select the latest permitted Artificial Analysis snapshot. The 2024
EvalPlus dataset lives at `/leaderboard/archive` or explicit `?source=evalplus`.
An absent current feed produces an honest coverage state, never a 2024 fallback.
Individual archived model/comparison URLs remain accessible with dated notices.
Historical model profiles are noindex and omitted from the current model sitemap.

Before merging this update, configure `AA_API_KEY`, `AA_PERMISSION_REFERENCE`, and
`AA_PUBLIC_DISPLAY_ENABLED=true` in Vercel, confirm public-display rights, and test
an AA import. API credentials are not in this repository and were not available
during development. A free API plan may provide headline quality, pricing, and
performance data; confirm actual coverage and applicable terms with the source.
The current V2 free endpoint is used, not a fabricated static list of new models.

After deployment, set GitHub `BNS_AA_IMPORT_ENABLED=true` and run **Refresh benchmark
snapshots**. `BNS_BENCHMARK_IMPORTS_ENABLED=true` and matching GitHub/Vercel
`CRON_SECRET` are also required. Check workflow success, `/leaderboard/changelog`,
source index version, model labels/release dates, and `/leaderboard/value`. A new
release appears only once the source includes it; missing scores stay unmeasured.
Do not describe this as real-time or comprehensive coverage of all released models.

No SQL migration is needed for this update. Existing snapshots are preserved.
If current feed setup is incomplete, leave this PR unmerged until the operator is
ready to replace the historical landing page with the current-coverage state.

# AI benchmarks: operations and rollout

## Product scope

An attributed benchmark explorer for developers building applications and agents.
Initial source: EvalPlus, 125 evaluated labels and four Python coding metrics.
The included results were last updated upstream on **26 December 2024**. They are
historical coverage, not current frontier rankings. Retrieval on 26 October 2026
is not an evaluation date. No original BuildnScale evaluations or votes are claimed.

Routes: `/leaderboard`, `/leaderboard/coding`, `/leaderboard/value`, `/models`,
`/models/[slug]`, `/compare`, `/compare/[pair]`, `/benchmarks/humaneval-plus`,
`/benchmarks/mbpp-plus`, `/leaderboard/methodology`, `/leaderboard/changelog`.

## Data architecture

The bundled, attributed snapshot renders without database access or source keys.
`lib/benchmarks/core.mjs` validates and normalizes data. Source adapters operate
server-side. Source model identifiers are preserved; AA identifiers have an `aa-`
prefix and source ID, rather than being fuzzily merged with EvalPlus models.

`BenchmarkSnapshot` stores an immutable, schema-versioned JSON payload and indexes
source, source revision, source update time, and retrieval time. This deliberately
keeps source-specific index versions and model configurations together instead of
normalizing incompatible metrics into one score table. PostgreSQL is the source
of published snapshot history. The app caches reads for one hour and invalidates
the cache after imports. A database failure falls back to bundled historical data
with its original visible source dates. Server logs report the fallback.

The current JSON schema is `schemaVersion: 1`. Before changing its interpretation,
add a version-specific migration/reader; do not rewrite stored historical payloads.
There is no cross-source overall score. Price estimates use explicit token budgets.
Missing prices, speeds, model licenses, context limits, settings, and uncertainty
are not invented. Client comparison state and filters do not require an account.

## New empty Supabase database without a local setup

For a newly created, empty Supabase project, open its SQL Editor as `postgres`,
copy the complete [bootstrap SQL](../supabase/bootstrap/buildnscale.sql), and run
it once. It creates all eight application tables, indexes, and foreign keys,
enables RLS, and revokes browser-role access. The application uses server-side
Prisma with the PostgreSQL credentials; Supabase Auth/Data API are not required.
This replaces local `prisma db push` plus the benchmark-only migration for initial
setup. It does not recover or migrate previous users or saved data.

The script is transactional and stops if any BuildnScale table already exists.
Do not run it against an established database; use reviewed incremental changes
there. A successful run returns eight table names. Keep credentials out of SQL,
Git, screenshots, and logs. Configure and verify Vercel's new connection separately.

## Deployment

1. Deploy the feature branch to a preview and run the checks below. The bundled
   historical explorer works without a database migration or source credentials.
2. Apply `supabase/migrations/20261026_benchmark_snapshots.sql` once through your
   database administration/migration process. It creates only `BenchmarkSnapshot`,
   indexes, and an RLS policy boundary; no existing user or monitoring data changes.
   Prisma client generation happens during install. This repository currently
   uses SQL migrations plus Prisma rather than a Prisma migration baseline; do not
   introduce `prisma migrate deploy` without baselining the existing database.
3. Configure the production `DATABASE_URL` and a strong `CRON_SECRET` in hosting.
   The application database role must be permitted to access the RLS-enabled table
   through the server. Do not expose the table to anonymous clients.
4. After production rollout, run an authenticated POST from your terminal (never
   paste the real secret into issue comments):

   ```bash
   curl --fail-with-body --request POST \
     --header "Authorization: Bearer $CRON_SECRET" \
     'https://www.buildnscale.dev/api/benchmarks/refresh?source=evalplus'
   ```

5. Verify `/leaderboard/changelog`, source URLs, canonical metadata, model 404s,
   and mobile comparison controls. The protected refresh endpoint rejects missing
   or invalid credentials. GET does not mutate data.
6. Add the same `CRON_SECRET` as a GitHub Actions secret and set repository variable
   `BNS_BENCHMARK_IMPORTS_ENABLED=true`. The daily workflow checks for data updates
   at 03:25 UTC. It is disabled until this variable is set. A failed request fails
   the workflow so GitHub can surface the failure; it does not clear old data.

Vercel deployment credentials/settings are not committed. Use the existing GitHub
integration. This change does not merge itself or claim a production deployment.
Keep the workflow disabled until the route and database are live.

## Artificial Analysis integration

The adapter follows the V2 `/api/v2/language/models/free` shape, including pagination,
source index version, nested pricing, and performance. Reference:
https://artificialanalysis.ai/api/v2/openapi . No V1 endpoint is assumed.

The live feed was not exercised during implementation because no credentials or
public-display agreement were available. Tests use representative contract fixtures;
an operator must verify the actual account response before enabling publication.

1. Obtain an API key and confirm the source terms/plan cover this public product.
   API access alone does not establish public-display/redistribution rights.
2. Set `AA_API_KEY`, `AA_PERMISSION_REFERENCE` (a non-secret agreement reference),
   and `AA_PUBLIC_DISPLAY_ENABLED=true` on the server.
3. POST to the refresh route with `?source=artificial-analysis` using `CRON_SECRET`.
4. Check the imported index version, source attribution, pricing units, and coverage.
   If correct, set GitHub repository variable `BNS_AA_IMPORT_ENABLED=true`.

Keys never reach browser code. Raw API responses and personal agreement text are
not committed. A missing upstream update date remains unknown and receives a
freshness warning; retrieval time never substitutes for an evaluation timestamp.
AA data is served with visible Artificial Analysis attribution. No bulk data API
or export is provided. Original AA agreement references stay in server configuration.

## Import integrity and failures

- Imports require HTTPS source links, valid timestamps and model IDs, valid numbers,
  explicit source provenance, and known metrics. Nulls stay null; numeric strings,
  NaN, negative values, duplicate IDs, and percentage scores above 100 are rejected.
- EvalPlus imports pin the JSON and license to the same immutable GitHub revision.
  If the license differs from the bundled Apache license, publication stops.
- A coverage drop exceeding 25%, or an existing same-version score changing by more
  than 10 points, stops publication for manual review. Do not silently bypass it.
- Snapshot publication is one atomic insert/upsert after validation; revisions are
  unique. Concurrent runs of the same revision cannot duplicate it. Existing
  revisions are not overwritten. An unchanged revision keeps its original import date.
- Pagination must complete with a consistent index version; partial AA feeds are
  rejected. Rate limits, network timeouts, and invalid payloads preserve old data.
- Server logs and failed workflow runs provide operational failure reporting.
  The public changelog lists successful publications, not unverified failed imports.

For a rejected large change, review the source evidence and adapter schema on a
branch. Adjust a justified threshold through code review, then rerun the importer.
For rollback, disable the importer variables and revert the application release.
Do not drop user tables or overwrite historical snapshots. If needed, remove only
an identified bad benchmark publication through an audited administrator operation.

## Verification

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:browser
node tests/benchmarks.e2e.mjs
```

The benchmark browser suite checks filter links, pagination, comparison selection,
missing data, pair canonicalization, model 404s, protected imports, mobile overflow,
and both themes. It uses bundled data without a production database.
`node scripts/seed-benchmarks.mjs` reproducibly rebuilds the normalized snapshot
from the bundled upstream JSON. Do not change dates to imply fresh evaluations.

## Discovery and future work

Navigation, home-page entry point, sitemap, canonical metadata, and a benchmark
Open Graph image are included. Model profiles and two benchmark explainers are
indexable. Uncurated pair comparisons and query comparison pages are `noindex`
to avoid manufacturing thousands of thin search pages. No search-traffic promise
or fabricated popularity statistics are made.

After permitted current coverage is connected, prioritize original developer
workload evaluations (React, TypeScript fixes, JSON validity, tool workflows),
then publish methodology, representative failures, run counts, and costs. Execute
untrusted generated code in isolated workers, separate from the website. Original
benchmark execution, community voting, newsletters/alerts, and paid data agreements
are later phases and are not represented as completed by this release.
