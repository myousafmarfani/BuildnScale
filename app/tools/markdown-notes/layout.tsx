import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: { index: true, follow: true },
  title: 'Markdown Notes — Free distraction-free note-taking for developers | buildnscale.dev',
  description:
    'Free distraction-free markdown editor with live preview. Syntax highlighting, auto-save, and fast capture for developer notes and build logs. No signup.',
  openGraph: {
    title: 'Markdown Notes — Free distraction-free editor | buildnscale.dev',
    description:
      'Write markdown with live preview and syntax highlighting. Free, no signup.',
    url: 'https://www.buildnscale.dev/tools/markdown-notes',
    images: ['/opengraph-image'],
  },
  twitter: {
    title: 'Markdown Notes — Free distraction-free editor | buildnscale.dev',
    description:
      'Write markdown with live preview and syntax highlighting.',
  },
}

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Markdown Notes",
  description: "Distraction-free markdown editor with live preview, syntax highlighting, and auto-save. Free for developers.",
  url: "https://www.buildnscale.dev/tools/markdown-notes",
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
    { "@type": "ListItem", position: 3, name: "Markdown Notes", item: "https://www.buildnscale.dev/tools/markdown-notes" },
  ],
}

export default function MarkdownNotesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {children}
    </>
  )
}
