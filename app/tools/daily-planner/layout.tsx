import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: true, follow: true },
  title: 'Daily Focus Planner — Free time-blocking tool for developers | buildnscale.dev',
  description:
    'Free daily focus planner for developers. Drag tasks into 30-min time blocks on a vertical day grid. No signup required. Local-first with optional cloud sync.',
  openGraph: {
    title: 'Daily Focus Planner — Free time-blocking tool | buildnscale.dev',
    description:
      'Plan your day in 30-min blocks. Free, no signup, local-first.',
    url: 'https://www.buildnscale.dev/tools/daily-planner',
    images: ['/opengraph-image'],
  },
  twitter: {
    title: 'Daily Focus Planner — Free time-blocking tool | buildnscale.dev',
    description:
      'Plan your day in 30-min blocks. Free, no signup, local-first.',
  },
}

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Daily Focus Planner",
  description: "Drag tasks into 30-min time blocks on a vertical day grid. Free time-blocking tool for developers.",
  url: "https://www.buildnscale.dev/tools/daily-planner",
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
    { "@type": "ListItem", position: 3, name: "Daily Focus Planner", item: "https://www.buildnscale.dev/tools/daily-planner" },
  ],
}

export default function PlannerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  )
}
