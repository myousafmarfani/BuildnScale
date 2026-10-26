# BuildnScale

Free, open-source productivity and developer tools for planning work, staying
focused, and handling everyday development tasks.

[Open the platform](https://www.buildnscale.dev) ·
[Browse tools](https://www.buildnscale.dev/tools) ·
[Contribute](CONTRIBUTING.md)

## Tools

| Tool | What it does |
| --- | --- |
| [Daily Planner](https://www.buildnscale.dev/tools/daily-planner) | Capture tasks and schedule your day in time blocks. |
| [Pomodoro](https://www.buildnscale.dev/tools/pomodoro) | Focus on a task, take breaks, and track completed sessions. |
| [Markdown Notes](https://www.buildnscale.dev/tools/markdown-notes) | Write, preview, search, and export notes. |
| [JSON Toolkit](https://www.buildnscale.dev/tools/json-toolkit) | Format, validate, and minify JSON in your browser. |
| [Downtime Detector](https://www.buildnscale.dev/tools/downtime-detector) | Check website responses and manage saved monitors. |
| [Rate Calculator](https://www.buildnscale.dev/tools/rate-calculator) | Estimate freelance rates and prepare printable invoices. |
| [Habit Tracker](https://www.buildnscale.dev/tools/habit-tracker) | Record check-ins and review consistency over time. |
| [Weekly Review](https://www.buildnscale.dev/tools/weekly-review) | Review focus time, completed tasks, habits, and reflections. |

## How it works

Personal productivity tools save work in your browser without requiring an account.
Export a [workspace backup](https://www.buildnscale.dev/tools#workspace-data) before
clearing site data or switching browsers. JSON input stays in the current tab and
is not saved. Website checks run on the server; accounts enable saved monitors
and optional sync for supported productivity data.

The workspace includes tool search, favorites, a collapsible sidebar, mobile
navigation, and light and dark themes.

## Run locally

Requires Node.js 20.9+ and pnpm.

```bash
git clone https://github.com/myousafmarfani/BuildnScale.git buildnscale
cd buildnscale
cp .env.example .env
pnpm install --frozen-lockfile
pnpm exec prisma generate
pnpm dev
```

Set a local `NEXTAUTH_SECRET` in `.env`, then open
[localhost:3000](http://localhost:3000). Accounts, sync, and saved monitoring require
PostgreSQL. See [development setup](CONTRIBUTING.md#local-development) for configuration
and test commands.

## Built with

Next.js App Router, React, TypeScript, Tailwind CSS, Prisma, PostgreSQL, and NextAuth.

## Contributing

Bug reports, usability improvements, documentation, and focused tool contributions
are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.
For workspace architecture and browser checks, see the
[tool experience guide](docs/tool-experience-redesign.md).

## License

[MIT](LICENSE) · Copyright © 2026 Muhammad Yousaf.
Third-party packages and fonts retain their own licenses; see
[third-party notices](THIRD_PARTY_NOTICES.md).
