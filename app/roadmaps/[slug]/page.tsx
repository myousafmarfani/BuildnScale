import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug } from '@/lib/blog';
import { getRoadmapBySlug, getRoadmapSlugs } from '@/lib/roadmaps';
import RoadmapHero from '@/components/roadmaps/RoadmapHero';
import RoadmapSidebar from '@/components/roadmaps/RoadmapSidebar';
import RoadmapProgress from '@/components/roadmaps/RoadmapProgress';
import CodeBlock from '@/components/roadmaps/CodeBlock';
import SkillBadge from '@/components/roadmaps/SkillBadge';
import { JsonLd } from '@/components/seo/JsonLd';

export const dynamicParams = false;

type PageParams = {
  slug: string;
};

function toIsoDuration(duration: string): string {
  const value = duration.toLowerCase();
  const numbers = [...value.matchAll(/\d+/g)].map((item) => Number(item[0]));
  const amount = numbers.length > 1 ? Math.round((numbers[0] + numbers[1]) / 2) : (numbers[0] ?? 1);

  if (value.includes('year')) return `P${amount}Y`;
  if (value.includes('week')) return `P${amount}W`;
  if (value.includes('day')) return `P${amount}D`;
  return `P${amount}M`;
}

function flattenChildrenText(children: React.ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map((item) => flattenChildrenText(item)).join(' ');
  }

  if (children && typeof children === 'object' && 'props' in children) {
    return flattenChildrenText((children as { props?: { children?: React.ReactNode } }).props?.children ?? '');
  }

  return '';
}

export async function generateStaticParams() {
  const slugs = await getRoadmapSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { slug } = await params;
  const roadmap = await getRoadmapBySlug(slug);

  if (!roadmap) {
    return { title: 'Roadmap Not Found | BuildnScale' };
  }

  const { meta } = roadmap;

  return {
    title: `${meta.title} | BuildnScale`,
    description: meta.description,
    keywords: meta.tags.join(', '),
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'article',
      publishedTime: meta.lastUpdated,
      tags: meta.tags,
      images: [
        {
          url: meta.ogImage,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
      url: `https://www.buildnscale.dev/roadmaps/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: [meta.ogImage],
    },
    alternates: {
      canonical: `https://www.buildnscale.dev/roadmaps/${slug}`,
    },
  };
}

export default async function RoadmapPage({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  const roadmap = await getRoadmapBySlug(slug);

  if (!roadmap) {
    notFound();
  }

  const { meta, content } = roadmap;

  const relatedPosts = (meta.relatedPosts ?? [])
    .slice(0, 6)
    .map((postSlug) => getPostBySlug(postSlug))
    .filter((post) => post !== null);

  const learningResourceSchema = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: meta.title,
    description: meta.description,
    url: `https://www.buildnscale.dev/roadmaps/${slug}`,
    educationalLevel: meta.difficulty,
    timeRequired: toIsoDuration(meta.duration),
    teaches: meta.tags,
    inLanguage: 'en',
    isAccessibleForFree: true,
    dateModified: meta.lastUpdated,
    author: {
      '@type': 'Person',
      name: 'M. Yousaf Marfani',
      url: 'https://www.buildnscale.dev/author',
    },
    publisher: {
      '@type': 'Organization',
      name: 'BuildnScale',
      url: 'https://www.buildnscale.dev',
    },
    image: meta.ogImage,
  };

  const roadmapSchema = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: meta.title,
    description: meta.description,
    provider: {
      '@type': 'Person',
      name: 'M. Yousaf Marfani',
      url: 'https://www.buildnscale.dev/author',
    },
    url: `https://www.buildnscale.dev/roadmaps/${slug}`,
  };

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
        name: 'Roadmaps',
        item: 'https://www.buildnscale.dev/roadmaps',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: meta.title,
        item: `https://www.buildnscale.dev/roadmaps/${slug}`,
      },
    ],
  };

  const mdxComponents = {
    h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
      const text = flattenChildrenText(children).trim();
      const phase = /phase\s*(\d+)/i.exec(text)?.[1];
      const numberLabel = phase ? String(Number(phase)).padStart(2, '0') : null;

      return (
        <h2
          {...props}
          id={phase ? `phase-${Number(phase)}` : text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
          data-phase-heading="true"
          className="mt-12 mb-4 flex scroll-mt-6 items-center gap-3 border-t border-blue-200 pt-8 text-blue-900 dark:border-blue-900/50 dark:text-blue-100"
        >
          {numberLabel ? (
            <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-blue-100 px-2 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              {numberLabel}
            </span>
          ) : null}
          <span>{children}</span>
        </h2>
      );
    },
    h3: ({ ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 {...props} className="mb-3 mt-6 text-lg font-semibold text-blue-800 dark:text-blue-200" />
    ),
    ul: ({ ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul {...props} className="space-y-2 my-4 ml-4 list-none" />
    ),
    li: ({ ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
      <li
        {...props}
        className="relative flex items-start gap-2 pl-4 text-muted-foreground leading-relaxed before:absolute before:left-0 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-muted-foreground/60"
      />
    ),
    blockquote: ({ ...props }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
      <blockquote
        {...props}
        className="my-6 rounded-r-md border-l-4 border-blue-500 bg-blue-50 px-4 py-3 text-blue-900 dark:bg-blue-950/30 dark:text-blue-100 [&>p]:m-0"
      />
    ),
    code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
      if (className?.includes('language-')) {
        return (
          <code {...props} className={className}>
            {children}
          </code>
        );
      }

      return (
        <code
          {...props}
          className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary"
        >
          {children}
        </code>
      );
    },
    pre: CodeBlock,
    a: ({ href = '', children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
      const external = href.startsWith('http');
      const internal = href.startsWith('/');

      if (internal) {
        return (
          <Link href={href} className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-400" {...props}>
            {children}
          </Link>
        );
      }

      return (
        <a
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
          {...props}
        >
          {children}
          {external ? ' ↗' : ''}
        </a>
      );
    },
  };

  return (
    <>
      <JsonLd data={learningResourceSchema} />
      <JsonLd data={roadmapSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-[300px_1fr]">
        <div className="self-start lg:sticky lg:top-6">
          <RoadmapSidebar meta={meta} slug={slug} />
        </div>

        <article className="min-w-0 rounded-2xl border border-blue-200/70 bg-linear-to-b from-blue-50/70 to-transparent p-6 dark:border-blue-900/40 dark:from-blue-950/20">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">→</li>
              <li>
                <Link href="/roadmaps" className="hover:text-foreground transition-colors">
                  Roadmaps
                </Link>
              </li>
              <li aria-hidden="true">→</li>
              <li aria-current="page" className="text-foreground">
                {meta.title}
              </li>
            </ol>
          </nav>

          <RoadmapHero meta={meta} />

          <div className="my-8">
            <RoadmapProgress slug={slug} totalPhases={meta.modules} />
          </div>

          <div className="prose prose-lg max-w-none prose-headings:text-blue-900 prose-strong:text-blue-900 dark:prose-invert dark:prose-headings:text-blue-100 dark:prose-strong:text-blue-100">
            <MDXRemote source={content} components={mdxComponents} />
          </div>

          {relatedPosts.length > 0 ? (
            <section>
              <hr className="border-border my-12" />
              <h2 className="mb-2 text-2xl font-bold text-foreground">From the Blog</h2>
              <p className="mb-6 text-muted-foreground">
                Deep-dives that go further on topics in this roadmap
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group rounded-lg border border-blue-200/70 bg-white p-4 transition-all hover:border-blue-500 hover:shadow-sm dark:border-blue-900/40 dark:bg-zinc-900/80"
                  >
                    <div className="flex gap-1.5">
                      {post.tags.slice(0, 2).map((tag) => (
                        <SkillBadge key={`${post.slug}-${tag}`} label={tag} variant="muted" />
                      ))}
                    </div>
                    <h3 className="mt-2 font-semibold text-foreground transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>
                    <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                      <span>{post.readTime}</span>
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </article>
      </div>
    </>
  );
}
