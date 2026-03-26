import { Suspense } from 'react';
import type { Metadata } from 'next';
import SearchClient from '@/components/search/SearchClient';

export const metadata: Metadata = {
  title: 'Search - BuildnScale',
  description:
    'Search BuildnScale tutorials, roadmaps, and engineering guides across Next.js, FastAPI, TypeScript, Python, and Agentic AI topics.',
  alternates: { canonical: 'https://www.buildnscale.dev/search' },
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: 'Search | BuildnScale',
    description: 'Find engineering tutorials and roadmap content across full-stack and AI domains.',
    url: 'https://www.buildnscale.dev/search',
    type: 'website',
  },
};

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">Loading search...</div>
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
