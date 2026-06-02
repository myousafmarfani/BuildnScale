import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pomodoro Timer + Task Log — Free focus tool for developers | buildnscale.dev',
  description:
    'Free Pomodoro timer for developers with automatic breaks and session logging. 25-minute focus sessions. Track output, not activity. Export CSV.',
  openGraph: {
    title: 'Pomodoro Timer + Task Log — Free focus tool | buildnscale.dev',
    description:
      '25-minute focus sessions with automatic breaks and task logging. Free, no signup.',
    url: 'https://buildnscale.dev/tools/pomodoro',
    images: ['/opengraph-image'],
  },
  twitter: {
    title: 'Pomodoro Timer + Task Log — Free focus tool | buildnscale.dev',
    description:
      '25-minute focus sessions with automatic breaks and task logging.',
  },
}

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Pomodoro Timer + Task Log",
  description: "25-minute focus sessions with automatic breaks and session logging. Free focus tool for developers.",
  url: "https://buildnscale.dev/tools/pomodoro",
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
    { "@type": "ListItem", position: 3, name: "Pomodoro Timer", item: "https://buildnscale.dev/tools/pomodoro" },
  ],
}

export default function PomodoroLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  )
}
