import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: true, follow: true },
  title: 'Habit Streak Tracker — Free consistency tool for developers | buildnscale.dev',
  description:
    'Free habit tracker with contribution-style heatmap. Build streaks that stick. Unlimited habits, daily check-ins, streak alerts. No signup required.',
  openGraph: {
    title: 'Habit Streak Tracker — Free consistency tool | buildnscale.dev',
    description:
      'Build streaks that stick with a contribution-style heatmap. Free, unlimited habits.',
    url: 'https://www.buildnscale.dev/tools/habit-tracker',
    images: ['/opengraph-image'],
  },
  twitter: {
    title: 'Habit Streak Tracker — Free consistency tool | buildnscale.dev',
    description:
      'Build streaks that stick with a contribution-style heatmap. Free, unlimited habits.',
  },
}

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Habit Streak Tracker",
  description: "Visualise consistency with a contribution-style heatmap. Free streak-building tool for developers.",
  url: "https://www.buildnscale.dev/tools/habit-tracker",
  applicationCategory: "Productivity",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.buildnscale.dev" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://www.buildnscale.dev/tools" },
    { "@type": "ListItem", position: 3, name: "Habit Streak Tracker", item: "https://www.buildnscale.dev/tools/habit-tracker" },
  ],
}

export default function HabitTrackerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  )
}
