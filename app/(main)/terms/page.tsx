import type { Metadata } from "next"
import Link from "next/link"
import { breadcrumbJsonLd } from "@/lib/json-ld"

export const metadata: Metadata = {
  title: "Terms of Service — buildnscale.dev",
  description: "Terms and conditions for using buildnscale.dev products and services.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Terms of Service — buildnscale.dev",
    description: "Terms and conditions for using buildnscale.dev products and services.",
    url: "https://www.buildnscale.dev/terms",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    title: "Terms of Service — buildnscale.dev",
    description: "Terms and conditions for using buildnscale.dev products and services.",
    images: ["/twitter-image"],
  },
}

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: "Home", url: "https://www.buildnscale.dev" },
            { name: "Terms of Service", url: "https://www.buildnscale.dev/terms" },
          ]))
        }}
      />
      <Link
        href="/"
        className="font-display mx-auto mb-12 block w-fit text-base font-semibold text-fg no-underline"
      >
        build<span className="text-teal">n</span>scale
      </Link>

      <h1 className="font-display text-3xl font-semibold text-fg sm:text-4xl">Terms of Service</h1>
      <p className="mt-2 text-sm text-tertiary">Last updated: May 28, 2026</p>

      <div className="mt-10 space-y-6 text-sm text-muted leading-relaxed">
        <section>
          <h2 className="font-display text-lg font-semibold text-fg mb-3">1. Acceptance</h2>
          <p>
            By using buildnscale.dev, you agree to these terms. If you do not agree, do not use the
            service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-fg mb-3">2. Service Description</h2>
          <p>
            buildnscale.dev provides a set of web-based productivity tools including a Daily Focus
            Planner, Pomodoro Timer, Habit Tracker, Markdown Notes, Freelancer Rate Calculator,
            Weekly Review Dashboard, and Downtime Detector. Tools are provided free of charge and
            may change or be removed at any time.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-fg mb-3">3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and
            for all activity under your account. You must notify us immediately of any unauthorized
            use.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-fg mb-3">4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use the service for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to any part of the service</li>
            <li>Use the service to distribute malware or harmful content</li>
            <li>Submit excessive automated requests that degrade service for others</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-fg mb-3">5. Data & Privacy</h2>
          <p>
            Your use of the service is also governed by our Privacy Policy, which explains how we
            collect, store, and process your personal data.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-fg mb-3">6. Limitation of Liability</h2>
          <p>
            buildnscale.dev is provided &ldquo;as is&rdquo; without any warranty, express or implied.
            We are not liable for any damages arising from your use of the service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-fg mb-3">7. Changes</h2>
          <p>
            We reserve the right to update these terms at any time. Continued use after changes
            constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-fg mb-3">8. Contact</h2>
          <p>
            Questions? Email <span className="text-teal">hello@buildnscale.dev</span>.
          </p>
        </section>
      </div>
    </main>
  )
}
