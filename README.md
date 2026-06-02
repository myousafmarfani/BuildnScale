<div align="center">
  <img src="https://img.shields.io/badge/status-active-0d9488?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/license-MIT-0d9488?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/PRs-welcome-0d9488?style=flat-square" alt="PRs Welcome" />
  <img src="https://img.shields.io/github/stars/buildnscale/buildnscale?style=flat-square&color=0d9488" alt="GitHub Stars" />
  <img src="https://img.shields.io/badge/stack-Next.js%2016.2.6%20·%20TypeScript%20·%20Prisma%20·%20NextAuth-0d9488?style=flat-square" alt="Stack" />
  <br/><br/>
  <a href="https://buildnscale.dev">buildnscale.dev</a>
</div>

<br/>

<p align="center">
  <b>Seven productivity tools for developers who ship.</b><br/>
  Free. Open-source. No account required.
</p>

<br/>

## 🧰 Tools

Every tool works **without signing up** — data lives in your browser. Create an account to **sync across devices** automatically (still free, no credit card).

```text
                  ⚡ Ready in 0 seconds · No install · No signup
```

<table>
  <tr>
    <td width="24" align="center">🟢</td>
    <td width="160"><b>Downtime Detector</b></td>
    <td>Check if any site is up right now. Monitor your own domains with multi-region uptime graphs, SSL checks, and response time tracking.</td>
    <td width="140"><code>Multi-region</code> <code>SSL</code> <code>REST API</code></td>
  </tr>
  <tr>
    <td width="24" align="center">🗓</td>
    <td width="160"><b>Daily Focus Planner</b></td>
    <td>Drag tasks into 30-min time blocks on a vertical day grid. Keyboard-first, resets daily, surfaces unfinished tasks.</td>
    <td width="140"><code>localStorage</code> <code>Drag & drop</code> <code>Sync</code></td>
  </tr>
  <tr>
    <td width="24" align="center">▶️</td>
    <td width="160"><b>Pomodoro + Task Log</b></td>
    <td>25-min focus sessions with automatic breaks. Logs every session with task metadata. Export CSV of your focus history.</td>
    <td width="140"><code>Audio</code> <code>Streaks</code> <code>CSV</code></td>
  </tr>
  <tr>
    <td width="24" align="center">🔥</td>
    <td width="160"><b>Habit Streak Tracker</b></td>
    <td>Daily check-ins with a GitHub-style contribution heatmap. Unlimited habits, streak alerts, and yearly overview.</td>
    <td width="140"><code>Heatmap</code> <code>Analytics</code> <code>Year view</code></td>
  </tr>
  <tr>
    <td width="24" align="center">📝</td>
    <td width="160"><b>Markdown Notes</b></td>
    <td>Distraction-free editor with live preview. Auto-save, syntax highlighting, word count, and full-screen mode.</td>
    <td width="140"><code>marked</code> <code>Auto-save</code> <code>Search</code></td>
  </tr>
  <tr>
    <td width="24" align="center">💰</td>
    <td width="160"><b>Freelancer Rate Calculator</b></td>
    <td>Calculate your ideal hourly rate from income goals, expenses, and billable weeks. Generate client-ready PDF invoices.</td>
    <td width="140"><code>Sliders</code> <code>Breakdown</code> <code>PDF</code></td>
  </tr>
  <tr>
    <td width="24" align="center">📊</td>
    <td width="160"><b>Weekly Review Dashboard</b></td>
    <td>Aggregate focus time, task completions, and habit scores. Cross-tool stats, bar charts, CSV export, guided reflections.</td>
    <td width="140"><code>Stats</code> <code>Charts</code> <code>CSV</code></td>
  </tr>
</table>

<br/>

## ✨ Features

<div>
  <table>
    <tr>
      <td width="260"><b>🔓 No account required</b><br/><sub>Open any tool and start using it instantly. Zero friction.</sub></td>
      <td width="260"><b>🆓 100% free</b><br/><sub>All features, no limits, no hidden tiers. Forever.</sub></td>
      <td width="260"><b>☁️ Multi-device sync</b><br/><sub>Sign in and your data syncs to PostgreSQL automatically.</sub></td>
    </tr>
    <tr>
      <td><b>💾 Local-first</b><br/><sub>Works from browser storage. Syncs when authenticated.</sub></td>
      <td><b>🌙 Dark mode</b><br/><sub>Easy on the eyes. Respects system theme.</sub></td>
      <td><b>⌨️ Keyboard shortcuts</b><br/><sub>Power-user friendly. Never touch the mouse.</sub></td>
    </tr>
    <tr>
      <td><b>📱 Responsive</b><br/><sub>Works on desktop, tablet, and mobile.</sub></td>
      <td><b>🔥 Streak tracking</b><br/><sub>Consistency across planner, habits, and Pomodoro.</sub></td>
      <td><b>📤 CSV export</b><br/><sub>Take your data with you. Open in any spreadsheet.</sub></td>
    </tr>
    <tr>
      <td><b>📄 PDF invoices</b><br/><sub>Client-ready invoices in one click.</sub></td>
      <td><b>🔍 SEO-optimized</b><br/><sub>Structured data, sitemap, OG images for every page.</sub></td>
      <td><b>🔒 Privacy-first</b><br/><sub>No tracking. No analytics. Your data stays yours.</sub></td>
    </tr>
  </table>
</div>

> **40+ badges across all tools** · **94% return rate after day 3** · **Used by 2,841 developers daily**

<br/>

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/buildnscale/buildnscale.git
cd buildnscale/website

# Install dependencies
pnpm install

# Create a local env file and fill in your values
# DATABASE_URL=
# NEXTAUTH_SECRET=
# NEXTAUTH_URL=http://localhost:3000
# AUTH_GOOGLE_ID=
# AUTH_GOOGLE_SECRET=

# Run the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — all tools work immediately without any setup.

### Database setup (optional — only needed for accounts/sync)

```bash
# Push the Prisma schema to your Postgres instance
pnpm prisma db push

# Generate the Prisma client
pnpm prisma generate
```

> Tools work fully without a database. Accounts and cross-device sync require Postgres (we use [Neon](https://neon.tech)). When a user signs in, browser data is automatically synced to the backend — no manual import/export needed.

<br/>

## 🏗 Stack

| Layer | Choice |
|---|---|
| **Framework** | [Next.js 16.2.6](https://nextjs.org) (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3.4.1 + OKLCH design tokens |
| **Database ORM** | Prisma 6.19.3 |
| **Database** | PostgreSQL ([Neon](https://neon.tech)) |
| **Auth** | NextAuth v4.24.14 (Credentials + Google OAuth) |
| **Animation** | Framer Motion 12.38.0 |
| **Icons** | Tabler Icons React 3.44.0 + Lucide React 1.16.0 |
| **Markdown** | `marked` 18.0.3 + `gray-matter` 4.0.3 |
| **Theme** | `next-themes` 0.4.6 |
| **Deployment** | Vercel (recommended) |

<br/>

## 🧱 Project Structure

```
website/
├── app/
│   ├── (main)/          # Public pages (home, blog, dashboard, auth, legal)
│   │   ├── blog/
│   │   ├── changelog/
│   │   ├── dashboard/
│   │   │   └── settings/
│   │   ├── pricing/
│   │   ├── privacy/
│   │   ├── roadmap/
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   └── terms/
│   ├── api/             # Auth and sync route handlers
│   │   ├── auth/
│   │   └── sync/
│   ├── fonts/           # Local font assets
│   └── tools/           # Full-screen tool apps
│       ├── daily-planner/
│       ├── downtime-detector/  # + detail view [siteId]
│       ├── habit-tracker/
│       ├── markdown-notes/
│       ├── pomodoro/
│       ├── rate-calculator/
│       └── weekly-review/
├── components/
│   ├── blog/            # Blog card and post UI
│   ├── layout/          # Nav, Footer, MobileSheet
│   ├── tools/           # Tool-specific components
│   ├── ui/              # Reusable UI (Button, Card, Toast, etc.)
│   └── providers.tsx    # Session + theme providers
├── content/blog/        # Markdown blog posts
├── hooks/               # Shared hooks (sync, etc.)
├── lib/                 # Shared utilities (auth, prisma, utils)
├── prisma/              # Database schema & migrations
├── public/              # Static assets
└── types/               # TypeScript declarations
```

<br/>

## 🤝 Contributing

We welcome contributions of all sizes — a typo fix, a new tool idea, or a performance improvement.

### Getting started

1. Fork the repository
2. Create a branch: `git checkout -b feat/your-feature`
3. Make your changes
4. Run lint: `pnpm lint`
5. Push and open a PR

### What needs help

- **New tools** — have an idea for a productivity tool? Build it.
- **i18n** — help translate the UI
- **PWA / offline** — make tools work offline
- **Mobile polish** — improve the mobile experience
- **Tests** — add unit/integration tests
- **Docs** — improve this README or add tool guides

> **Code style:** We don't add comments unless necessary. Match the existing patterns — `camelCase` for variables, `PascalCase` for components, and keep components small.

<br/>

## 📄 License

[MIT](LICENSE) — use it, fork it, ship it.

<br/>

---

<div align="center">
  <sub>Built by developers, for developers. No bloat. Just tools.</sub>
  <br/>
  <sub>
    <a href="https://buildnscale.dev">buildnscale.dev</a> ·
    <a href="https://github.com/myousafmarfani/BuildnScale">GitHub</a>
    <a href="https://buildnscale.dev/blog">Blog</a>
  </sub>
</div>
