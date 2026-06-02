import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service — buildnscale.dev",
  description: "Terms and conditions for using buildnscale.dev products and services.",
  robots: { index: false, follow: true },
}

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16 sm:py-24">
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
            By creating an account or using any tool on buildnscale.dev, you agree to these Terms.
            If you do not agree, do not use the service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-fg mb-3">2. Description of Service</h2>
          <p>
            buildnscale.dev provides web-based productivity tools including a daily planner, Pomodoro
            timer, habit tracker, markdown notes, freelance rate calculator, and weekly review. Tools
            are available at no cost.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-fg mb-3">3. Accounts</h2>
          <p>
            You are responsible for safeguarding your password and for all activity under your
            account. You must be at least 13 years old to use the service. You may not use the
            service for any illegal or unauthorized purpose.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-fg mb-3">4. Acceptable Use</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Do not attempt to bypass authentication or access another user&apos;s data</li>
            <li>Do not submit content that is unlawful, harmful, or infringes on others&apos; rights</li>
            <li>Do not use automated scripts to scrape or overload the service</li>
            <li>Do not reverse-engineer, decompile, or attempt to extract the source code</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-fg mb-3">5. Data Ownership</h2>
          <p>
            You retain full ownership of the data you enter into the tools. We claim no intellectual
            property rights over your content. We may use aggregated, anonymized data to improve the
            service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-fg mb-3">6. Service Availability</h2>
          <p>
            We strive for 99.9% uptime but make no guarantees. The service is provided &ldquo;as
            is&rdquo; without warranty of any kind. We may temporarily suspend access for maintenance
            or security reasons.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-fg mb-3">7. Limitation of Liability</h2>
          <p>
            buildnscale.dev and its operators shall not be liable for any indirect, incidental, or
            consequential damages arising from your use of the service. Your sole remedy is to stop
            using the service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-fg mb-3">8. Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts that violate these Terms. You may
            delete your account at any time by contacting us. Upon termination, your data will be
            deleted within 30 days.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-fg mb-3">9. Changes</h2>
          <p>
            We may update these Terms. Material changes will be notified via email. Continued use
            after changes take effect constitutes acceptance.
          </p>
        </section>
      </div>
    </main>
  )
}
