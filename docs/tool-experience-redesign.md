# Tool detail experience redesign

## Architecture

`app/tools/layout.tsx` applies `ToolWorkspace` to recognized tool detail URLs, including nested monitor detail pages. `/tools` retains the public catalog layout. The workspace has one header and a desktop tool rail. Home, All tools, Build log, Roadmap, and account entry are available in the rail and the mobile navigation dialog. Ctrl/Command + K opens searchable tools and site pages. Browser-native dialogs contain keyboard focus, support Escape, and return focus to their trigger.

Each tool owns its work area, not another site header. Tool pages use the same titles, controls, panel rhythm, local-save feedback, and responsive spacing. The shell hydrates before rendering local/date-dependent work so statically generated HTML does not supply yesterday's date or stale browser state.

## Tool workflows

- **Planner:** task-first quick capture; optional time/duration; inline edits; list/timeline modes; overlap validation; completion; undo delete; explicit carry-forward of unfinished work; CSV export. The selected view is remembered locally.
- **Focus timer:** central countdown and start/pause; task queue; daily progress; exportable completed sessions; browser-local active timer restoration after navigation/reload; notifications requested only through an explicit opt-in control. Timer preferences require pausing first.
- **Notes:** searchable list, remembered selected note, autosaving editor, split/preview modes on desktop, Notes/Write/Preview on mobile; Markdown/text import; sanitized preview and Markdown export. A compact editing layout makes room when the viewport is short.
- **Habits:** daily check-ins first; week correction controls with future dates disabled; real streaks and elapsed-opportunity completion; configurable heatmap; starter suggestions are optional rather than invented user data.
- **Rate calculator:** goals and billable availability separated from a sticky result; currency selector; accurate monthly average; explicit pricing-buffer wording; client/project/hour entry and printable invoice summary.
- **Weekly review:** real cross-tool activity; week navigation and first-day preference; simple focus chart; three autosaving reflections; export and a clear return to planning.
- **Monitoring:** quick guest check separate from saved account monitors; honest response/status/region results; inline monitor creation; explicit rename/check/history/remove controls; shared navigation remains available on monitor details.
- **JSON:** one workspace header, readable input/output panels that stack on small screens, instant validation, and guarded copy/download actions. Input remains unsaved and browser-local.

The changes keep existing task, note, habit, session, calculation, and reflection storage keys. Native preferences and browser storage remain optional; storage errors are surfaced in tools using `useBrowserData`. Cloud conflict behavior is unchanged from the previous upgrade: existing local values win. No database migration is required.

## Design references

Patterns were reviewed in primary product documentation, not copied as branded designs:

- [Todoist Quick Add](https://www.todoist.com/help/todoist/features/use-task-quick-add-in-todoist-va4Lhpzz): capture first, details as needed.
- [Todoist calendar](https://www.todoist.com/help/todoist/features/use-the-calendar-layout-in-todoist-lPHRQTu0o): list and schedule are alternative views, including non-drag scheduling.
- [Pomofocus](https://pomofocus.io/): active task, timer, breaks, and session history.
- [Obsidian workspace](https://obsidian.md/help/workspace): writing-focused center with optional supporting navigation.

## Validation

```bash
pnpm install --frozen-lockfile
pnpm exec prisma generate
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:browser
```

`test:browser` starts a local production server by default. Set `BNS_TEST_BASE_URL` to test a running staging server, `BNS_QA_DIR` to choose the screenshot directory, or `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to use an installed Chromium executable.

- Ten core tests cover date/week boundaries, adjacent and overlapping schedules, current versus longest streak, elapsed habit opportunities, JSON, outbound-address guards, CSV, and registered routes.
- Browser checks cover all eight tools at 320, 390, 768, and 1440 CSS pixels, checking page/workspace overflow and runtime errors.
- Interaction checks exercise planner completion/persistence/overlap, modal focus/Escape, mobile navigation and search, notes persistence/sanitization, habit check-ins, timer reload recovery, weekly reflections, calculator output and invoice required fields, and JSON failure states.
- Additional screenshots cover populated light-mode workspaces at mobile and desktop widths. Desktop/mobile screenshots were visually inspected.
- Guest check responses and signed-in monitoring create/rename/history/remove flows are mocked browser tests. They validate the UI contract; they do not validate production credentials, database access, DNS, or real monitoring availability.

A responsive Chromium check is not a claim of testing every physical device or browser. Production authentication and monitoring integrations still need staging credentials for end-to-end verification. No production data is changed by these tests.

## Navigation follow-up

The desktop tool sidebar has an explicit expand/collapse toggle. Collapse hides the rail and gives its width back to the tool. The preference survives reloads and tool changes; the separate mobile menu remains available. Blog filter and article bars share the public header height, and heading anchor offsets clear both sticky bars. Article contents has an accessible persisted disclosure, shown above the article on mobile and in the sidebar on desktop. Browser regression checks cover both disclosure states, reload persistence, sticky geometry, and heading navigation.
