# Contributing to BuildnScale

Help make practical tools easier to use. Contributions can be code, documentation,
bug reports, accessibility fixes, or thoughtful feedback.

## Before you start

Search [existing issues](https://github.com/myousafmarfani/BuildnScale/issues)
and [pull requests](https://github.com/myousafmarfani/BuildnScale/pulls) first.
Small fixes can go straight to a PR. For a new tool, a major redesign, or a new
service dependency, open an issue describing the user problem and proposed scope
before building it.

Bug reports should include reproduction steps, expected and actual behavior,
and the browser/device involved. Add a screenshot or a minimal example when useful.
Remove personal data, credentials, and private URLs from examples. Report security
vulnerabilities privately to hello@buildnscale.dev rather than in a public issue.

## Local development

Use Node.js 20.9+ and pnpm. Fork the repository, then clone your fork:

```bash
git clone https://github.com/YOUR_USERNAME/BuildnScale.git buildnscale
cd buildnscale
git switch -c fix/describe-your-change
cp .env.example .env
pnpm install --frozen-lockfile
pnpm exec prisma generate
```

Configure `.env` for the feature you are working on:

| Configuration | Needed for |
| --- | --- |
| `NEXTAUTH_SECRET` and `NEXTAUTH_URL` | Local authentication/session configuration. Set the URL to `http://localhost:3000`. |
| `DATABASE_URL` | PostgreSQL for accounts, cloud sync, and saved monitors. |
| `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` | Google sign-in. |
| `CRON_SECRET` | Authorized scheduled monitoring requests. |
| `BUTTONDOWN_API_KEY` | Newsletter subscriptions. |

Generate a local authentication secret with `openssl rand -base64 32` and put it
in `NEXTAUTH_SECRET`. Use your own development credentials, and never commit `.env`.
Browser-local tool work does not need a running database. Account, sync, and saved
monitoring changes need a development PostgreSQL instance. Initialize that database
with:

```bash
pnpm exec prisma db push
```

Run this against your own development database, then start the app:

```bash
pnpm dev
```

Open [localhost:3000](http://localhost:3000). Google sign-in, newsletter, and scheduled
monitoring can remain unconfigured unless your change uses them.

## Making changes

- Use TypeScript and the existing React, Tailwind, and shared-component patterns.
- Keep tool metadata in `lib/tools-registry.ts` and reuse the workspace navigation.
- Preserve existing browser-storage keys and saved data, or describe the migration.
- Make primary actions usable by touch and keyboard. Check narrow screens and both themes.
- Avoid unrelated refactors or dependencies. Add comments where they explain intent.
- Preserve third-party copyright and license notices.

Changes to `prisma/schema.prisma` should explain the database rollout and any effect
on existing data. Do not test against production accounts or databases.

## Checking your work

For application changes, run:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

For tool UI or navigation changes, also run the browser suite after building:

```bash
pnpm exec playwright install chromium
pnpm test:browser
```

Browser installation is a one-time setup. The suite starts a local production
server and covers responsive layouts and key interactions. Monitoring/account
responses are mocked; integration changes need separate testing with development
credentials. More options are in the
[tool experience guide](docs/tool-experience-redesign.md#validation).

For documentation-only changes, check spelling, Markdown rendering, links, and
commands. A full application build is not required.

## Opening a pull request

Target `main` with one focused change. Use a clear title and explain the problem,
the resulting behavior, and how you verified it. Include screenshots for visual
changes and mention anything not tested. Update relevant documentation when
behavior or setup changes.

Keep discussion respectful and specific. Respond to review feedback and keep the
PR focused; maintainers will review its fit with the platform before merging.

## License

Contributions are made under the project's [MIT License](LICENSE). Submit only
work you have the right to share. Bundled third-party materials keep their own
licenses; see [third-party notices](THIRD_PARTY_NOTICES.md).
