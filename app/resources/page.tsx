import Link from 'next/link';
import Image from 'next/image';
import {
  Star,
  CheckCircle,
  ExternalLink,
  ArrowRight,
  Clock,
  Calendar,
  Package,
  Info,
  Zap,
  Shield,
  TrendingUp,
} from 'lucide-react';
import { affiliateResources } from '@/lib/data';
import { getAllPosts } from '@/lib/blog';
import { formatDate } from '@/lib/utils';
import BlogSidebar from '@/components/sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resources | M. Yousuf',
  description:
    'Recommended tools, hosting providers, databases and learning resources I personally use. Honest reviews with exclusive discounts for readers.',
  openGraph: {
    title: 'Resources | M. Yousuf',
    description:
      'Tools and services I personally use and recommend. Honest reviews and exclusive discounts.',
    type: 'website',
  },
};

const categoryIcons: Record<string, React.ReactNode> = {
  'Web Hosting': <Zap size={14} />,
  Database: <Shield size={14} />,
  Default: <TrendingUp size={14} />,
};

const categoryStyles: Record<string, { bg: string; text: string; border: string; cardBg: string }> = {
  'Web Hosting': {
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    border: 'border-blue-500/20',
    cardBg: 'from-blue-500/5 via-transparent to-cyan-500/5',
  },
  Database: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-500',
    border: 'border-emerald-500/20',
    cardBg: 'from-emerald-500/5 via-transparent to-teal-500/5',
  },
  Default: {
    bg: 'bg-violet-500/10',
    text: 'text-violet-500',
    border: 'border-violet-500/20',
    cardBg: 'from-violet-500/5 via-transparent to-purple-500/5',
  },
};

function getStyle(category: string) {
  return categoryStyles[category] ?? categoryStyles['Default'];
}

export default function ResourcesPage() {
  const allPosts = getAllPosts();
  const featuredResource = affiliateResources[0];
  const categories = Array.from(new Set(affiliateResources.map((r) => r.category)));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Page Header ──────────────────────────────────────────── */}
      <section className="pt-4 pb-12 border-b border-zinc-200 dark:border-zinc-800 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Package size={16} className="text-blue-500" />
          <span className="text-xs font-semibold tracking-widest uppercase text-blue-500">
            Resources
          </span>
        </div>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Recommended Resources
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl leading-relaxed">
              Tools, platforms, and services I personally use and vouch for. Real discounts,
              honest reviews — no filler.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium shrink-0 self-start mt-1">
            <Info size={12} />
            Contains affiliate links
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-6 mt-5 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Package size={14} className="text-blue-500" />
            {affiliateResources.length} Recommended Tools
          </span>
          <span className="flex items-center gap-1.5">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />
            All personally tested
          </span>
        </div>
      </section>

      {/* ── Main Layout ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ── Left: Content ──────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-14">

          {/* Editor's Pick — Featured Resource */}
          <section className="space-y-5">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-1.5 h-5 bg-blue-500 rounded-full inline-block" />
              Editor&apos;s Pick
            </h2>

            <a
              href={featuredResource.link}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="group block relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-linear-to-br from-blue-500/5 via-transparent to-cyan-500/5 p-7 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/8 transition-all duration-300"
            >
              {/* Decorative */}
              <div className="pointer-events-none absolute top-0 right-0 w-64 h-64 rounded-full bg-linear-to-br from-blue-500/10 to-cyan-500/8 blur-3xl" />

              <div className="relative">
                <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <h3 className="text-2xl font-bold group-hover:text-blue-500 transition-colors">
                        {featuredResource.name}
                      </h3>
                      <span className="px-2.5 py-1 rounded-full bg-green-500 text-white text-xs font-bold shadow-sm">
                        {featuredResource.discount}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium border border-amber-500/20">
                        Sponsored
                      </span>
                    </div>
                    <span className="text-xs text-zinc-400 font-medium">{featuredResource.category}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-2xl font-bold text-blue-500">{featuredResource.price}</div>
                    <div className="flex items-center gap-1 text-xs justify-end mt-1">
                      <Star size={12} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        {featuredResource.rating}
                      </span>
                      <span className="text-zinc-400">/5</span>
                    </div>
                  </div>
                </div>

                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-5 text-base">
                  {featuredResource.description}
                </p>

                <div className="flex flex-wrap gap-4 mb-6">
                  {featuredResource.features.map((feature, fi) => (
                    <span
                      key={fi}
                      className="flex items-center gap-1.5 text-sm text-zinc-600 dark:text-zinc-400"
                    >
                      <CheckCircle size={14} className="text-green-500 shrink-0" />
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="inline-flex items-center gap-2 bg-blue-500 group-hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-500/25">
                    Claim Deal <ExternalLink size={13} />
                  </div>
                  <span className="text-xs text-zinc-400">Exclusive discount for readers</span>
                </div>
              </div>
            </a>
          </section>

          {/* Resources by Category */}
          {categories.map((category) => {
            const categoryResources = affiliateResources.filter((r) => r.category === category);
            const style = getStyle(category);
            const icon = categoryIcons[category] ?? categoryIcons['Default'];

            return (
              <section key={category} className="space-y-5">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-semibold ${style.bg} ${style.text} border ${style.border}`}
                  >
                    {icon}
                    {category}
                  </span>
                </h2>

                <div className="space-y-4">
                  {categoryResources.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className={`group block relative overflow-hidden p-6 bg-linear-to-br ${style.cardBg} rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300`}
                    >
                      <div className="flex items-start justify-between mb-3 flex-wrap gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1 flex-wrap">
                            <h3 className="text-lg font-bold group-hover:text-blue-500 transition-colors">
                              {resource.name}
                            </h3>
                            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                              {resource.discount}
                            </span>
                          </div>
                          <span className="text-xs text-zinc-400 font-medium">{resource.category}</span>
                        </div>

                        <div className="text-right shrink-0 ml-4">
                          <div className="text-xl font-bold text-blue-500">{resource.price}</div>
                          <div className="flex items-center gap-1 text-xs justify-end mt-0.5">
                            <Star size={11} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-zinc-600 dark:text-zinc-400 font-medium">
                              {resource.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4 leading-relaxed">
                        {resource.description}
                      </p>

                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex flex-wrap gap-3">
                          {resource.features.map((feature, fi) => (
                            <span
                              key={fi}
                              className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400"
                            >
                              <CheckCircle size={12} className="text-green-500 shrink-0" />
                              {feature}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-blue-500 flex items-center gap-1 font-medium opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          View deal <ExternalLink size={11} />
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            );
          })}

          {/* Affiliate Disclosure */}
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
            <div className="flex items-start gap-3">
              <Info size={15} className="text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-800 dark:text-amber-300 text-sm mb-1">
                  Affiliate Disclosure
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-400/80 leading-relaxed">
                  Some links on this page are affiliate links. I earn a small commission if you
                  make a purchase at no extra cost to you. I only recommend products I personally
                  use and believe provide genuine value to developers.
                </p>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {allPosts.length > 0 && (
            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-violet-500 rounded-full inline-block" />
                  Related Articles
                </h2>
                <Link
                  href="/blog"
                  className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                >
                  View all <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {allPosts.slice(0, 4).map((post, idx) => (
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
                    <div className="p-4 space-y-2.5">
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, 2).map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-bold text-sm leading-snug group-hover:text-blue-500 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          {formatDate(post.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {post.readTime}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ── Right: Sidebar ─────────────────────────────────────── */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-28">
            <BlogSidebar />
          </div>
        </aside>
      </div>
    </main>
  );
}
