import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Free productivity tools for developers',
  description:
    'Browse 7 free productivity tools built for developers who ship. Daily planner, Pomodoro timer, habit tracker, markdown notes, rate calculator, weekly review, and downtime detector. No signup required.',
  openGraph: {
    title: 'Free productivity tools for developers | buildnscale.dev',
    description:
      'Browse 7 free productivity tools built for developers. No signup, no bloat, just open and use.',
    url: 'https://buildnscale.dev/tools',
    images: ['/opengraph-image'],
  },
  twitter: {
    title: 'Free productivity tools for developers | buildnscale.dev',
    description:
      'Browse 7 free productivity tools built for developers who ship.',
  },
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://buildnscale.dev" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://buildnscale.dev/tools" },
  ],
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  )
}
