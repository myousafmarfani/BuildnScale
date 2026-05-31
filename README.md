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
  <b>Six productivity tools for developers who ship.</b><br/>
  Free. Open-source. No account required.
</p>

<br/>

## 🧰 Tools

| Tool | What it does | Tech notes |
|---|---|---|
| **Daily Focus Planner** | Drag tasks into 30-min time blocks on a vertical day grid | `localStorage`, keyboard-first, cloud sync |
| **Pomodoro + Task Log** | 25-min focus sessions with auto breaks and session history | Audio beep, streak tracking, task queue |
| **Habit Streak Tracker** | Daily check-ins with contribution-style heatmap | GitHub-style year view, streak analytics |
| **Markdown Notes** | Distraction-free editor with live preview | `marked` renderer, auto-save, search |
| **Freelancer Rate Calculator** | Calculate hourly rate + generate PDF invoices | Sliders, profit margin, print-to-PDF |
| **Weekly Review Dashboard** | Aggregate focus time, tasks, habits per week | Cross-tool stats, CSV export, reflections |

Every tool works **without signing up**. Data lives in your browser. Create an account to **sync across devices** automatically through `/api/sync` — still free, still no credit card needed.

<br/>

## ✨ Features

- **No account required** — open any tool and start using it instantly
- **100% free** — all features, no limits, no hidden tiers
- **Multi-device sync** — sign in and your `localStorage` data syncs to PostgreSQL automatically
- **Local-first** — works from browser storage and syncs when authenticated
- **Dark mode** — respects the app theme setting
- **Keyboard shortcuts** — power-user friendly
- **Responsive** — works on desktop and mobile
- **Streak tracking** — consistency across the planner, habits, and pomodoro tools
- **CSV export** — take your data with you
- **PDF invoices** — generate client-ready invoices in one click

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
