import Link from 'next/link';
import Image from 'next/image';
import { Clock, Calendar, BookOpen, Rss, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllPosts } from '@/lib/blog';
import { getAllRoadmaps } from '@/lib/roadmaps';
import { affiliateResources } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import BlogSidebar from '@/components/sidebar';
import type { Metadata } from 'next';

const POSTS_PER_PAGE = 6;

export const metadata: Metadata = {
  title: 'Blog | M. Yousuf',
  description:
    'Deep-dive tutorials on Next.js, FastAPI, and Agentic AI — from architecture to production-ready deployment.',
  openGraph: {
    title: 'Blog | M. Yousuf',
    description:
      'Deep-dive tutorials on Next.js, FastAPI, and Agentic AI — from architecture to production-ready deployment.',
    type: 'website',
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tag?: string }>;
}) {
  const { page: pageParam, tag: tagParam } = await searchParams;

  const currentPage = Math.max(1, parseInt(pageParam || '1', 10));
  const activeTag = tagParam || null;

  const allPosts = getAllPosts();
  const roadmaps = await getAllRoadmaps();
  const allTags = Array.from(new Set(allPosts.flatMap((p) => p.tags))).sort();

  const filteredPosts = activeTag
    ? allPosts.filter((p) => p.tags.includes(activeTag))
    : allPosts;

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pagePosts = filteredPosts.slice(
    (safePage - 1) * POSTS_PER_PAGE,
    safePage * POSTS_PER_PAGE
  );

  const sidebarRoadmaps = roadmaps.slice(0, 3).map((roadmap) => ({
    title: roadmap.title,
    description: roadmap.headline,
    href: `/roadmaps/${roadmap.slug}`,
    meta: roadmap.difficulty,
  }));

  const sidebarResources = affiliateResources.slice(0, 4).map((resource) => ({
    name: resource.name,
    description: resource.description,
    href: resource.link,
    tag: resource.category,
  }));

  const buildHref = (p: number, tag?: string | null) => {
    const params = new URLSearchParams();
    if (p > 1) params.set('page', String(p));
    if (tag) params.set('tag', tag);
    const qs = params.toString();
    return `/blog${qs ? `?${qs}` : ''}`;
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Page Header ──────────────────────────────────────────── */}
      <section className="pt-4 pb-12 border-b border-zinc-200 dark:border-zinc-800 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Rss size={16} className="text-blue-500" />
          <span className="text-xs font-semibold tracking-widest uppercase text-blue-500">Blog</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          All Articles
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl leading-relaxed">
          Deep-dives on Next.js, FastAPI, and Agentic AI — from architecture to production-ready
          deployment.
        </p>
        <p className="text-sm text-zinc-400 mt-3">
          {filteredPosts.length}{activeTag ? ` articles tagged "${activeTag}"` : ' articles published'}
        </p>
      </section>

      {/* ── Main Layout ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ── Left: Posts + Filters ──────────────────────────────── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Tag Filters */}
          <div className="flex flex-wrap gap-2">
            <Link
              href="/blog"
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                !activeTag
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-500'
              }`}
            >
              All
            </Link>
            {allTags.map((tag) => (
              <Link
                key={tag}
                href={buildHref(1, tag)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                  activeTag === tag
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-500'
                }`}
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Post Grid */}
          {pagePosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pagePosts.map((post, idx) => (
                <Link
                  key={idx}
                  href={`/blog/${post.slug}`}
                  className="group block bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.tags.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-bold text-base leading-snug group-hover:text-blue-500 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-zinc-400 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={11} />
                        {formatDate(post.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-zinc-400">
              <BookOpen size={40} className="mx-auto mb-4 opacity-40" />
              <p className="text-base font-medium mb-1">No articles found</p>
              <p className="text-sm mb-4">No posts match the selected filter.</p>
              <Link
                href="/blog"
                className="text-blue-500 text-sm font-medium hover:underline"
              >
                Clear filter
              </Link>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6 border-t border-zinc-100 dark:border-zinc-800">
              <Link
                href={safePage > 1 ? buildHref(safePage - 1, activeTag) : '#'}
                aria-disabled={safePage <= 1}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                  safePage <= 1
                    ? 'border-zinc-100 dark:border-zinc-800 text-zinc-300 dark:text-zinc-700 pointer-events-none'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-500'
                }`}
              >
                <ChevronLeft size={15} />
                Prev
              </Link>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={buildHref(p, activeTag)}
                    className={`w-9 h-9 rounded-xl border text-sm font-medium flex items-center justify-center transition-colors ${
                      p === safePage
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-500'
                    }`}
                  >
                    {p}
                  </Link>
                ))}
              </div>

              <Link
                href={safePage < totalPages ? buildHref(safePage + 1, activeTag) : '#'}
                aria-disabled={safePage >= totalPages}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                  safePage >= totalPages
                    ? 'border-zinc-100 dark:border-zinc-800 text-zinc-300 dark:text-zinc-700 pointer-events-none'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-500'
                }`}
              >
                Next
                <ChevronRight size={15} />
              </Link>
            </div>
          )}
        </div>

        {/* ── Right: Sidebar ─────────────────────────────────────── */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-28">
            <BlogSidebar roadmaps={sidebarRoadmaps} resources={sidebarResources} />
          </div>
        </aside>
      </div>
    </main>
  );
}
