import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 — Page Not Found | BuildnScale',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-blue-500">404</p>
      <h1 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">Page Not Found</h1>
      <p className="mb-8 max-w-xl text-zinc-600 dark:text-zinc-300">
        The page you are looking for does not exist or may have moved. Continue exploring practical
        full-stack and agentic AI engineering content below.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
        >
          Go to Homepage
        </Link>
        <Link
          href="/blog"
          className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:border-blue-500 hover:text-blue-500 dark:border-zinc-700 dark:text-zinc-200"
        >
          Browse Blog
        </Link>
        <Link
          href="/resources"
          className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:border-blue-500 hover:text-blue-500 dark:border-zinc-700 dark:text-zinc-200"
        >
          View Resources
        </Link>
      </div>
    </main>
  );
}
