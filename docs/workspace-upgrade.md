# BuildnScale workspace upgrade

## Problem and changes

The suite had seven tools with independent hardcoded catalogs, mismatched categories, inactive controls, expired catalog promises, and little support for returning to a useful tool. This upgrade keeps the existing routes and browser data keys while introducing a shared registry and a coherent forest/lime visual system in light and dark modes.

- Homepage: clear task-oriented entry points, an explicitly labeled sample workspace, working calls to action, build log, and issue-based feedback.
- Catalog: query search, categories, favorites, recent tools, empty states, and browser-data backup/restore with an explicit replacement preview.
- Navigation: shared registry across desktop/mobile menus, footer, tool switcher, and sitemap. Keyboard and narrow-screen access to all tools.
- Planner: half-hour drop bubbling fixed, overlap checks, accessible time selection for scheduling without drag, completion/unscheduling of scheduled tasks, settings wired to storage, CSV export, and weekly-review navigation.
- Timer: wall-clock-based countdown after tab throttling, configurable cycle indicators, correct long-break progress, CSV logs, and queue access from the mobile change-task action. Pause before changing timer settings.
- Notes: immediate persistence, Ctrl and Command shortcuts, HTML sanitization, and remote media blocked in previews.
- Habits: actual historical longest streak; completion based on elapsed opportunities since habit creation; functional heatmap range setting. Reset settings no longer deletes all habit data.
- Rate calculator: hydration-safe saved settings, escaped invoice text, bounded division, and visible popup-blocked feedback.
- Weekly review: up-to-date browser stats after hydration/focus, no fictional habits, correct first-day-of-week behavior, immediate reflection persistence, and CSV export.
- Monitoring: actual execution region, correct HTTP success classification, validated and DNS-pinned outbound requests (including redirects), bounded cron concurrency, ownership-scoped history, and 30-day summaries based on more than the latest check.
- Sync: cancellation/cleanup, only restore absent browser keys, refresh the visible tool after restoration, and retry failed uploads without acknowledging them. Local values win conflicts; this is not collaborative real-time editing.
- Tool addition: JSON Toolkit with formatting, validation, minification, file input, copy/download, and unsafe-integer detection. Input is deliberately not saved or synced.

## Product rationale

JSON Toolkit fits the platform's stated developer audience and provides an immediately useful operation without accounts, server costs, or external API keys. It is a hypothesis based on audience fit, not on verified search volume or user interviews. Search, favorites, recent tools, exports, and backups address friction in the existing suite before expanding it further.

The repository and public site do not provide access to GA4 usage, retention, traffic sources, or user interviews. No claim is made that UI alone explains low adoption. After release, compare tool opens, completed actions, and repeat visits before choosing the next tool. Do not capture note contents, task titles, JSON input, or monitor URLs in analytics events.

## Validation and release notes

Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.

Core regression tests cover JSON syntax/unsafe numeric values, public-address validation, URL normalization, safe CSV text, and registered routes. The production build includes all eight tool routes and the new tool in the sitemap.

No database migration is required. Existing auth, database, cron, and mail environment variables are retained. The uptime checker runs on Node.js and makes outbound requests from one deployment region. It does not provide independent certificate auditing or distributed probes. The guest limiter is per-process and should use a shared store if traffic grows.

Browser interaction and visual QA require a reachable preview deployment. Localhost was unavailable to the connected browser in this environment. Authenticated database workflows require configured staging credentials and have not been exercised against production data.

Review backup import, narrow-screen navigation, timer pause/resume and background-tab return, note reload/export, invoice printing, and signed-in monitor CRUD on staging before merging. Account sync preserves local values when both devices contain a key; manually clear a local workspace only after exporting a backup if a cloud restore is desired.
