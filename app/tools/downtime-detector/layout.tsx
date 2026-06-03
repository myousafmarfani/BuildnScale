import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: true, follow: true },
  title: 'Downtime Detector — Free uptime monitoring tool | buildnscale.dev',
  description:
    'Free website downtime detector and uptime monitoring tool. Check if any site is up right now. Monitor your domains with real-time uptime graphs, SSL checks, and multi-region pings. No signup for basic checks.',
  openGraph: {
    title: 'Downtime Detector — Free uptime monitoring | buildnscale.dev',
    description:
      'Check site status & monitor uptime with multi-region pings and SSL checks. Free.',
    url: 'https://buildnscale.dev/tools/downtime-detector',
    images: ['/opengraph-image'],
  },
  twitter: {
    title: 'Downtime Detector — Free uptime monitoring | buildnscale.dev',
    description:
      'Check site status & monitor uptime with multi-region pings and SSL checks.',
  },
}

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Downtime Detector",
  description: "Check if any site is up right now. Monitor your domains with real-time uptime graphs, SSL checks, and multi-region pings.",
  url: "https://buildnscale.dev/tools/downtime-detector",
  applicationCategory: "Developer Application",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://buildnscale.dev" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://buildnscale.dev/tools" },
    { "@type": "ListItem", position: 3, name: "Downtime Detector", item: "https://buildnscale.dev/tools/downtime-detector" },
  ],
}

export default function DowntimeDetectorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  )
}
