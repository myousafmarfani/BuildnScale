import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { AlertTriangle, ArrowLeft, ArrowUpRight, CheckCircle2, ExternalLink } from 'lucide-react';
import { JsonLd } from '@/components/seo/JsonLd';
import BlogSidebar from '@/components/sidebar';
import ScrollAwareSidebar from '@/components/scroll-aware-sidebar';
import TableOfContents from '@/components/table-of-contents';
import RoadmapCTA from '@/components/roadmaps/RoadmapCTA';
import { getAllPosts } from '@/lib/blog';
import { getAllResources, getResourceBySlug, getResourcesBySlugs } from '@/lib/resources';
import { formatDate } from '@/lib/utils';

export async function generateStaticParams() {
  const resources = await getAllResources();
  return resources.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);
  if (!resource) return {};

  const url = `https://www.buildnscale.dev/resources/${slug}`;
  return {
    title: resource.seoTitle,
    description: resource.seoDescription,
    alternates: { canonical: url },
    openGraph: {
      title: resource.seoTitle,
      description: resource.seoDescription,
      url,
      type: 'website',
      siteName: 'BuildnScale',
    },
    twitter: {
      card: 'summary',
      title: resource.seoTitle,
      description: resource.seoDescription,
    },
  };
}

function paragraphize(text: string): string[] {
  return text
    .split('\n\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function getJsonLd(resource: Awaited<ReturnType<typeof getResourceBySlug>>) {
  if (!resource) return null;

  const offers = resource.pricing.map((item) => ({
    '@type': 'Offer',
    name: item.plan,
    price: item.price,
    priceCurrency: 'USD',
    description: item.features.join(', '),
    url: resource.url,
  }));

  const featureList = resource.keyFeatures.map((item) => item.title);

  if (resource.category === 'Learning Platforms') {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          name: resource.name,
          description: resource.description,
          url: resource.url,
        },
        {
          '@type': 'LearningResource',
          name: resource.name,
          description: resource.longDescription,
          url: resource.url,
          offers,
          featureList,
        },
      ],
    };
  }

  const applicationCategory =
    resource.category === 'Databases' ? 'DatabaseApplication' : 'DeveloperApplication';

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: resource.name,
    description: resource.longDescription,
    url: resource.url,
    applicationCategory,
    offers,
    featureList,
  };
}

export default async function ResourceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resource = await getResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  const alternatives = getResourcesBySlugs(resource.alternatives);
  const relatedPosts = getAllPosts().filter((post) => resource.relatedArticles.includes(post.slug));
  const jsonLd = getJsonLd(resource);
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.buildnscale.dev',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Resources',
        item: 'https://www.buildnscale.dev/resources',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: resource.name,
        item: `https://www.buildnscale.dev/resources/${slug}`,
      },
    ],
  };
  const sidebarResources = alternatives.slice(0, 4).map((alternative) => ({
    name: alternative.name,
    description: alternative.description,
    href: alternative.url,
    tag: alternative.category,
  }));
  const headings = [
    { text: `What Is ${resource.name}?`, level: 2, id: 'what-is' },
    { text: `Key Features of ${resource.name}`, level: 2, id: 'key-features' },
    { text: `Who Should Use ${resource.name}?`, level: 2, id: 'use-cases' },
    { text: 'Pros & Cons', level: 2, id: 'pros-cons' },
    { text: `${resource.name} Pricing`, level: 2, id: 'pricing' },
    { text: `Getting Started with ${resource.name}`, level: 2, id: 'getting-started' },
    { text: 'Alternatives to Consider', level: 2, id: 'alternatives' },
    { text: 'Related Articles', level: 2, id: 'related-articles' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {jsonLd ? <JsonLd data={jsonLd} /> : null}
      <JsonLd data={breadcrumbSchema} />

      <div className="mb-8">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Resources
        </Link>
      </div>

      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <li>
            <Link href="/" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/resources" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
              Resources
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-zinc-800 dark:text-zinc-200">
            {resource.name}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_280px] gap-8 xl:gap-12">
        <aside className="hidden lg:block">
          <ScrollAwareSidebar className="pr-1">
            <TableOfContents headings={headings} />
          </ScrollAwareSidebar>
        </aside>

        <article className="min-w-0 space-y-10">
          <section className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 bg-zinc-50 dark:bg-zinc-900/60 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">
                {resource.category}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                {resource.price}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">{resource.name}</h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">{resource.longDescription}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                Visit {resource.name} <ArrowUpRight size={14} />
              </a>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Last verified: {formatDate(resource.lastVerified)}</p>
            </div>
          </section>

          <section id="what-is" className="scroll-mt-28 space-y-4">
            <h2 className="text-2xl font-bold">What Is {resource.name}?</h2>
            <div className="space-y-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {paragraphize(resource.whatItIs).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          <section id="key-features" className="scroll-mt-28 space-y-4">
            <h2 className="text-2xl font-bold">Key Features of {resource.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resource.keyFeatures.map((feature) => (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 bg-white dark:bg-zinc-900"
                >
                  <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{feature.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="use-cases" className="scroll-mt-28 space-y-4">
            <h2 className="text-2xl font-bold">Who Should Use {resource.name}?</h2>
            <div className="space-y-4">
              {resource.useCases.map((useCase) => (
                <article key={useCase.title} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                  <h3 className="font-semibold">{useCase.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1 leading-relaxed">{useCase.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="pros-cons" className="scroll-mt-28 space-y-4">
            <h2 className="text-2xl font-bold">Pros &amp; Cons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/40 p-5 bg-emerald-50/50 dark:bg-emerald-900/10">
                <h3 className="font-semibold mb-3 text-emerald-700 dark:text-emerald-300">Pros</h3>
                <ul className="space-y-2">
                  {resource.pros.map((pro) => (
                    <li key={pro} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-200">
                      <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-amber-200 dark:border-amber-900/40 p-5 bg-amber-50/50 dark:bg-amber-900/10">
                <h3 className="font-semibold mb-3 text-amber-700 dark:text-amber-300">Cons</h3>
                <ul className="space-y-2">
                  {resource.cons.map((con) => (
                    <li key={con} className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-200">
                      <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section id="pricing" className="scroll-mt-28 space-y-4">
            <h2 className="text-2xl font-bold">{resource.name} Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resource.pricing.map((plan) => (
                <article key={plan.plan} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 bg-white dark:bg-zinc-900">
                  <h3 className="font-semibold text-lg">{plan.plan}</h3>
                  <p className="text-blue-500 font-bold mt-1">{plan.price}</p>
                  <ul className="mt-3 space-y-1.5">
                    {plan.features.map((item) => (
                      <li key={item} className="text-sm text-zinc-600 dark:text-zinc-300 flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-blue-500 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Pricing is subject to change. Verify on the official website before purchasing.
            </p>
          </section>

          <section id="getting-started" className="scroll-mt-28 space-y-4">
            <h2 className="text-2xl font-bold">Getting Started with {resource.name}</h2>
            <div className="space-y-3 text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {paragraphize(resource.gettingStarted).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-5 py-2.5 text-sm font-semibold transition-colors"
            >
              Go to {resource.name} <ExternalLink size={14} />
            </a>
          </section>

          <section id="alternatives" className="scroll-mt-28 space-y-4">
            <h2 className="text-2xl font-bold">Alternatives to Consider</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alternatives.map((alternative) => (
                <Link
                  key={alternative.slug}
                  href={`/resources/${alternative.slug}`}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-blue-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">{alternative.category}</p>
                  <h3 className="font-semibold">{alternative.name}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2 leading-relaxed">{alternative.description}</p>
                </Link>
              ))}
            </div>
          </section>

          <section id="related-articles" className="scroll-mt-28 space-y-4">
            <h2 className="text-2xl font-bold">Related Articles</h2>
            <div className="space-y-3">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 hover:border-blue-500/40 transition-colors"
                >
                  <h3 className="font-semibold">{post.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={`${post.slug}-${tag}`}
                        className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{post.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </article>

        <aside className="hidden lg:block">
          <ScrollAwareSidebar>
            <BlogSidebar
              roadmapCta={<RoadmapCTA tags={resource.tags} />}
              resources={sidebarResources}
              professionalCta={{
                title: `Explore ${resource.name}`,
                description: 'Open the official website, compare alternatives, and keep your stack production-ready.',
                primaryLabel: `Visit ${resource.name}`,
                primaryHref: resource.url,
                secondaryLabel: 'Browse all resources',
                secondaryHref: '/resources',
              }}
            />
          </ScrollAwareSidebar>
        </aside>
      </div>
    </main>
  );
}



