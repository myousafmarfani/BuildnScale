import type { Metadata } from 'next';
import { Suspense } from 'react';
import RoadmapFilterBar from '@/components/roadmaps/RoadmapFilterBar';
import RoadmapNotifyModal from '@/components/roadmaps/RoadmapNotifyModal';
import RoadmapSuggestionForm from '@/components/roadmaps/RoadmapSuggestionForm';
import { getAllRoadmaps } from '@/lib/roadmaps';

const pageTitle = 'Developer Roadmaps 2026 | BuildnScale';
const pageDescription =
  'Free, opinionated learning roadmaps for 2026. Structured paths for Full-Stack Web Development and AI Engineering — written from real production experience by M. Yousuf.';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      type: 'website',
      url: 'https://buildnscale.dev/roadmaps',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
    },
    alternates: {
      canonical: 'https://buildnscale.dev/roadmaps',
    },
  };
}

export default async function RoadmapsPage() {
  const roadmaps = await getAllRoadmaps();
  const roadmapUrls = roadmaps.map((roadmap) => `https://buildnscale.dev/roadmaps/${roadmap.slug}`);

  const collectionPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Developer Roadmaps 2026 | BuildnScale',
    description: pageDescription,
    url: 'https://buildnscale.dev/roadmaps',
    inLanguage: 'en',
    author: { '@type': 'Person', name: 'M. Yousuf', url: 'https://buildnscale.dev/author' },
    hasPart: [
      {
        '@type': 'LearningResource',
        name: 'Full-Stack Web Developer Roadmap 2026',
        url: 'https://buildnscale.dev/roadmaps/full-stack-developer',
      },
      {
        '@type': 'LearningResource',
        name: 'AI Engineer Roadmap 2026',
        url: 'https://buildnscale.dev/roadmaps/ai-engineer',
      },
      ...roadmapUrls
        .filter(
          (url) =>
            url !== 'https://buildnscale.dev/roadmaps/full-stack-developer' &&
            url !== 'https://buildnscale.dev/roadmaps/ai-engineer'
        )
        .map((url) => ({ '@type': 'LearningResource', name: url.split('/').pop(), url })),
    ],
  };

  return (
    <main className="space-y-12 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }}
      />

      <section className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-10 md:px-10">
        <div className="pointer-events-none absolute -top-24 right-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Roadmaps</p>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Developer Roadmaps</h1>
          <p className="max-w-3xl text-lg text-muted-foreground">
            Structured, opinionated learning paths built from real production experience — not recycled tutorials.
          </p>
          <div className="flex flex-wrap gap-2.5 pt-1 text-sm">
            <span className="rounded-full border border-border bg-background/80 px-3 py-1.5 font-medium">
              {roadmaps.length} Career Paths
            </span>
            <span className="rounded-full border border-border bg-background/80 px-3 py-1.5 font-medium">
              Updated March 2026
            </span>
            <span className="rounded-full border border-border bg-background/80 px-3 py-1.5 font-medium">
              100% Free
            </span>
          </div>
        </div>
      </section>

      <Suspense
        fallback={
          <section className="space-y-6">
            <div className="h-10 w-full animate-pulse rounded-full bg-muted" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="h-64 animate-pulse rounded-2xl bg-muted" />
              <div className="h-64 animate-pulse rounded-2xl bg-muted" />
            </div>
          </section>
        }
      >
        <RoadmapFilterBar roadmaps={roadmaps} />
      </Suspense>

      <section className="space-y-4 rounded-3xl border border-dashed border-blue-200/80 bg-linear-to-br from-white to-blue-50/60 p-6 dark:border-blue-900/40 dark:from-zinc-900/60 dark:to-blue-950/20">
        <h2 className="text-2xl font-bold">More Roadmaps Coming</h2>
        <article className="max-w-md rounded-2xl border border-blue-200/80 bg-linear-to-br from-white to-blue-50/70 p-5 dark:border-blue-900/40 dark:from-zinc-900/70 dark:to-blue-950/20">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-700 dark:text-blue-300">Upcoming</span>
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              Coming Soon
            </span>
          </div>
          <h3 className="text-lg font-semibold">DevOps & Cloud</h3>
          <p className="mt-1 text-sm text-muted-foreground">Curriculum in progress. Get notified at launch.</p>
          <RoadmapNotifyModal roadmapTitle="DevOps & Cloud" />
        </article>
      </section>

      <section className="rounded-2xl border border-blue-200/70 bg-gradient-to-br from-white to-blue-50/60 p-6 dark:border-blue-900/40 dark:from-zinc-900/60 dark:to-blue-950/20">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            Suggest a roadmap topic
          </h2>
          <p className="text-muted-foreground">
            Share a topic you want covered. We will notify you when your request is fulfilled.
          </p>
        </div>
        <div className="mt-4">
          <RoadmapSuggestionForm className="max-w-3xl" />
        </div>
      </section>
    </main>
  );
}
