import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: true, follow: true },
  title: 'Weekly Review Dashboard — Free reflection tool for developers | buildnscale.dev',
  description:
    'Free weekly review dashboard for developers. Aggregate focus time, task completions, and habit scores. Export CSV. Reflect on output every week.',
  openGraph: {
    title: 'Weekly Review Dashboard — Free reflection tool | buildnscale.dev',
    description:
      'Aggregate focus time, task completions, and habit scores. Free weekly review.',
    url: 'https://buildnscale.dev/tools/weekly-review',
    images: ['/opengraph-image'],
  },
  twitter: {
    title: 'Weekly Review Dashboard — Free reflection tool | buildnscale.dev',
    description:
      'Aggregate focus time, task completions, and habit scores.',
  },
}

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Weekly Review Dashboard",
  description: "Aggregate focus time, task completions, and habit scores. Free reflection tool for developers.",
  url: "https://buildnscale.dev/tools/weekly-review",
  applicationCategory: "Productivity",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://buildnscale.dev" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://buildnscale.dev/tools" },
    { "@type": "ListItem", position: 3, name: "Weekly Review Dashboard", item: "https://buildnscale.dev/tools/weekly-review" },
  ],
}

export default function WeeklyReviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  )
}
