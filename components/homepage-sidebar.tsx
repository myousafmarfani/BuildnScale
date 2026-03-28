import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight, TrendingUp, BookOpen } from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { formatDate } from '@/lib/utils';

interface HomepageSidebarProps {
  posts: BlogPost[];
}

export default function HomepageSidebar({ posts }: HomepageSidebarProps) {
  const recommended = posts.slice(0, 5);
  const alsoRead = posts.slice(0, 3);

  return (
    <div className="space-y-8">

      {/* ── Recommended Posts ── */}
      <div className="bg-zinc-50 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-linear-to-r from-blue-500/10 to-cyan-500/5">
          <TrendingUp size={16} className="text-blue-500" />
          <h3 className="font-bold text-sm tracking-wide">Recommended Posts</h3>
        </div>

        {/* Post list */}
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {recommended.map((post, idx) => (
            <Link
              key={idx}
              href={`/blog/${post.slug}`}
              className="group flex items-start gap-3 px-5 py-4 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
            >
              {/* Thumbnail */}
              <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-zinc-200 dark:bg-zinc-800">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-blue-500 transition-colors">
                  {post.title}
                </p>
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <Clock size={10} />
                  <span>{post.readTime}</span>
                </div>
              </div>

              <ArrowRight
                size={14}
                className="text-zinc-300 dark:text-zinc-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0 mt-1"
              />
            </Link>
          ))}
        </div>

        {/* Footer link */}
        <div className="px-5 py-3 border-t border-zinc-200 dark:border-zinc-800">
          <Link
            href="/search"
            className="flex items-center justify-center gap-1.5 text-xs text-blue-500 hover:text-blue-600 font-medium transition-colors"
          >
            View all posts <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* ── Also Read ── */}
      <div className="bg-zinc-50 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-linear-to-r from-cyan-500/10 to-blue-500/5">
          <BookOpen size={16} className="text-cyan-500" />
          <h3 className="font-bold text-sm tracking-wide">Also Read</h3>
        </div>

        <div className="space-y-0 divide-y divide-zinc-100 dark:divide-zinc-800">
          {alsoRead.map((post, idx) => (
            <Link
              key={idx}
              href={`/blog/${post.slug}`}
              className="group block px-5 py-4 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                {post.tags.slice(0, 1).map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-medium"
                  >
                    {tag}
                  </span>
                ))}
                <span className="text-[10px] text-zinc-400">{formatDate(post.date)}</span>
              </div>
              <p className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-blue-500 transition-colors">
                {post.title}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Tags Cloud ── */}
      <div className="bg-zinc-50 dark:bg-zinc-900/70 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 space-y-4">
        <h3 className="font-bold text-sm">Popular Topics</h3>
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(posts.flatMap((p) => p.tags))).slice(0, 12).map((tag, i) => (
            <Link
              key={i}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="text-xs px-3 py-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
