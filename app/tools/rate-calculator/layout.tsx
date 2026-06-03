import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: true, follow: true },
  title: 'Freelancer Rate Calculator — Free pricing tool for developers | buildnscale.dev',
  description:
    'Calculate your ideal hourly freelance rate based on income goals, expenses, and billable weeks. Generate client-ready PDF invoices. Free, no signup.',
  openGraph: {
    title: 'Freelancer Rate Calculator — Free pricing tool | buildnscale.dev',
    description:
      'Calculate your ideal hourly rate and generate PDF invoices. Free for freelancers.',
    url: 'https://www.buildnscale.dev/tools/rate-calculator',
    images: ['/opengraph-image'],
  },
  twitter: {
    title: 'Freelancer Rate Calculator — Free pricing tool | buildnscale.dev',
    description:
      'Calculate your ideal hourly rate and generate PDF invoices. Free for freelancers.',
  },
}

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Freelancer Rate Calculator",
  description: "Calculate your ideal hourly rate and generate PDF invoices. Free pricing tool for freelancers.",
  url: "https://www.buildnscale.dev/tools/rate-calculator",
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
    { "@type": "ListItem", position: 3, name: "Freelancer Rate Calculator", item: "https://www.buildnscale.dev/tools/rate-calculator" },
  ],
}

export default function RateCalcLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  )
}
