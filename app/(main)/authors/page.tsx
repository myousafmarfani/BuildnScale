import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllAuthors } from '@/lib/authors'
import { breadcrumbJsonLd } from '@/lib/json-ld'

export const metadata: Metadata = {
  title: 'Authors — buildnscale.dev',
  description: 'Meet the developers and engineers writing about productivity, AI, and open-source tooling at BuildnScale.',
  openGraph: {
    title: 'Authors — buildnscale.dev',
    description: 'Meet the developers and engineers writing about productivity, AI, and open-source tooling at BuildnScale.',
    url: 'https://www.buildnscale.dev/authors',
    type: 'website',
    images: ['/opengraph-image'],
  },
  twitter: {
    title: 'Authors — buildnscale.dev',
    description: 'Meet the developers and engineers writing about productivity, AI, and open-source tooling at BuildnScale.',
    images: ['/twitter-image'],
  },
  robots: { index: true, follow: true },
}

export default function AuthorsIndexPage() {
  const authors = getAllAuthors()

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd([
            { name: 'Home', url: 'https://www.buildnscale.dev' },
            { name: 'Authors', url: 'https://www.buildnscale.dev/authors' },
          ]))
        }}
      />
      <header className="border-b border-border">
        <div className="container-site section-pad">
          <h1 className="font-display text-hero font-bold tracking-tighter text-fg">
            Authors.
          </h1>
          <p className="mt-4 text-lg text-muted max-w-[600px] leading-relaxed">
            Meet the people behind BuildnScale.
          </p>
        </div>
      </header>

      <main className="container-site pb-20">
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {authors.map(author => (
            <Link
              key={author.slug}
              href={`/authors/${author.slug}`}
              className="flex flex-col items-center text-center bg-surface border border-border rounded-lg p-8 no-underline group hover:border-muted transition-colors"
            >
              <Image
                src={author.avatar}
                alt={author.name}
                width={96}
                height={96}
                className="rounded-full object-cover mb-5"
              />
              <h2 className="font-display text-lg font-semibold text-fg group-hover:text-teal transition-colors">
                {author.name}
              </h2>
              <p className="text-sm text-tertiary mt-1 leading-relaxed">
                {author.bio}
              </p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
