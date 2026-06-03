import type { Metadata } from "next"
import Link from "next/link"
import { breadcrumbJsonLd } from "@/lib/json-ld"

export const metadata: Metadata = {
  title: "Privacy Policy — buildnscale.dev",
  description: "How buildnscale.dev collects, uses, and protects your personal data. We never sell your data.",
  openGraph: {
    title: "Privacy Policy — buildnscale.dev",
    description: "How buildnscale.dev collects, uses, and protects your personal data. We never sell your data.",
    url: "https://buildnscale.dev/privacy",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    title: "Privacy Policy — buildnscale.dev",
    description: "How buildnscale.dev collects, uses, and protects your personal data. We never sell your data.",
    images: ["/twitter-image"],
  },
  robots: { index: false, follow: false },
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: "Home", url: "https://buildnscale.dev" },
            { name: "Privacy Policy", url: "https://buildnscale.dev/privacy" },
          ]))
        }}
      />
      <Link
        href="/"
        className="font-display mx-auto mb-12 block w-fit text-base font-semibold text-fg no-underline"
      >
        build<span className="text-teal">n</span>scale
      </Link>

      <h1 className="font-display text-3xl font-semibold text-fg sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-tertiary">Last updated: May 28, 2026</p>

      <div className="mt-10 space-y-6 text-sm text-muted leading-relaxed">
        <section>
          <h2 className="font-display text-lg font-semibold text-fg mb-3">1. What We Collect</h2>
          <p>
            When you sign up for an account, we collect your name, email address, and a
            securely-hashed password. If you sign in with Google, we receive the email address and
            profile information you authorize.
          </p>
          <p className="mt-3">
            When you use our tools (Daily Planner, Pomodoro Timer, Habit Tracker, Markdown Notes,
            Rate Calculator, Weekly Review), we store your session data, tasks, notes, and settings
            solely to provide the service. This data is associated with your account.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-fg mb-3">2. How We Use It</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>To authenticate you and maintain your session</li>
            <li>To persist your tool data across devices and sessions</li>
            <li>To improve the product through aggregated, anonymized usage patterns</li>
            <li>To send occasional product updates (only if you opt in)</li>
          </ul>
          <p className="mt-3">We never sell your personal data to third parties.</p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-fg mb-3">3. Data Storage</h2>
          <p>
            Your data is stored on servers provided by Neon (PostgreSQL) and Vercel. Both providers
            maintain SOC 2 compliance and industry-standard encryption at rest and in transit.
            Passwords are hashed with bcrypt (12 rounds) before storage.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-fg mb-3">4. Cookies</h2>
          <p>
            We use a session cookie (next-auth.session-token) to keep you logged in. This is a
            strictly necessary cookie — no tracking, no analytics cookies are set. You can block
            cookies in your browser settings, but you will need to sign in each visit.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-fg mb-3">5. Third-Party Services</h2>
          <p>
            We use Google OAuth solely as an authentication mechanism. When you choose Google sign-in,
            Google shares your email and profile info per their consent screen. We do not receive or
            store your Google access tokens beyond the initial authentication handshake.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-fg mb-3">6. Your Rights</h2>
          <p>
            You can request a copy of your data or ask us to delete your account and all associated
            data by emailing <span className="text-teal">hello@buildnscale.dev</span>. We will
            respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-fg mb-3">7. Changes</h2>
          <p>
            If we make material changes to this policy, we will notify you via email and update the
            &ldquo;Last updated&rdquo; date at the top of this page.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-fg mb-3">8. Contact</h2>
          <p>
            Questions? Email <span className="text-teal">hello@buildnscale.dev</span> or open an
            issue on our GitHub repository.
          </p>
        </section>
      </div>
    </main>
  )
}
