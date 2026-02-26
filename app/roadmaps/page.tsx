import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Clock,
  Users,
  ChevronRight,
  ArrowRight,
  Calendar,
  MapPin,
  Zap,
  Target,
  CheckCircle,
} from 'lucide-react';
import { roadmaps } from '@/lib/data';
import { getAllPosts } from '@/lib/blog';
import { formatDate } from '@/lib/utils';
import BlogSidebar from '@/components/sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learning Roadmaps | M. Yousuf',
  description:
    'Structured, step-by-step career paths for Full-Stack Development, AI Engineering, and DevOps & Cloud. Start where you are — build where you want to go.',
  openGraph: {
    title: 'Learning Roadmaps | M. Yousuf',
    description:
      'Structured career paths curated from real-world experience in Full-Stack, AI, and DevOps.',
    type: 'website',
  },
};

const roadmapMeta = [
  {
    icon: '🚀',
    gradient: 'from-blue-500 to-cyan-500',
    iconBg: 'bg-blue-500/10',
    iconText: 'text-blue-500',
    accent: 'border-blue-500/40',
    badge: 'Most Popular',
    badgeBg: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
    skills: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'Databases', 'Deployment'],
  },
  {
    icon: '🤖',
    gradient: 'from-violet-500 to-purple-600',
    iconBg: 'bg-violet-500/10',
    iconText: 'text-violet-500',
    accent: 'border-violet-500/40',
    badge: 'Trending',
    badgeBg: 'bg-violet-500/10 text-violet-500 border border-violet-500/20',
    skills: ['Python', 'Math/Stats', 'ML Fundamentals', 'Deep Learning', 'LLMs', 'MLOps'],
  },
  {
    icon: '☁️',
    gradient: 'from-emerald-500 to-teal-600',
    iconBg: 'bg-emerald-500/10',
    iconText: 'text-emerald-500',
    accent: 'border-emerald-500/40',
    badge: 'In Demand',
    badgeBg: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    skills: ['Linux', 'Git/CI-CD', 'Docker', 'Kubernetes', 'AWS/GCP', 'Monitoring'],
  },
];

export default function RoadmapsPage() {
  const allPosts = getAllPosts();
  const featuredRoadmap = roadmaps[0];
  const featuredMeta = roadmapMeta[0];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Page Header ──────────────────────────────────────────── */}
      <section className="pt-4 pb-12 border-b border-zinc-200 dark:border-zinc-800 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={16} className="text-blue-500" />
          <span className="text-xs font-semibold tracking-widest uppercase text-blue-500">
            Roadmaps
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Learning Roadmaps
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl leading-relaxed">
          Structured, step-by-step career paths curated from real-world experience. Start where you
          are — build where you want to go.
        </p>
        <div className="flex flex-wrap items-center gap-6 mt-5 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Target size={14} className="text-blue-500" />
            {roadmaps.length} Career Paths
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={14} className="text-blue-500" />
            5.5K+ Students Enrolled
          </span>
          <span className="flex items-center gap-1.5">
            <Zap size={14} className="text-blue-500" />
            Updated 2026
          </span>
        </div>
      </section>

      {/* ── Main Layout ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ── Left: Content ──────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-14">

          {/* Featured Roadmap */}
          <section className="space-y-5">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-1.5 h-5 bg-blue-500 rounded-full inline-block" />
              Featured Roadmap
            </h2>

            <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-linear-to-br from-blue-500/5 via-transparent to-cyan-500/5 p-8 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/8 transition-all duration-300">
              {/* Decorative blobs */}
              <div className="pointer-events-none absolute top-0 right-0 w-72 h-72 rounded-full bg-linear-to-br from-blue-500/10 to-cyan-500/10 blur-3xl" />
              <div className="pointer-events-none absolute bottom-0 left-0 w-40 h-40 rounded-full bg-blue-500/5 blur-2xl" />

              <div className="relative">
                <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-2xl shadow-lg shadow-blue-500/25">
                      {featuredMeta.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold group-hover:text-blue-500 transition-colors">
                        {featuredRoadmap.title}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                        Self-paced · Free
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${featuredMeta.badgeBg}`}>
                    {featuredMeta.badge}
                  </span>
                </div>

                <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                  {featuredRoadmap.description}. Each module builds on the last, taking you from complete beginner to job-ready developer with real projects to show.
                </p>

                {/* Skill chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {featuredMeta.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium"
                    >
                      <CheckCircle size={11} className="text-blue-500" />
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400 mb-6 border-t border-zinc-200 dark:border-zinc-800 pt-5">
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={14} className="text-blue-500" />
                    {featuredRoadmap.modules}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-blue-500" />
                    {featuredRoadmap.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={14} className="text-blue-500" />
                    {featuredRoadmap.students}
                  </span>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <Link
                    href={`/blog?tag=${encodeURIComponent('Full-Stack')}`}
                    className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-blue-500/25"
                  >
                    Start Learning <ChevronRight size={15} />
                  </Link>
                  <span className="text-xs text-zinc-400">Free · No sign-up required</span>
                </div>
              </div>
            </div>
          </section>

          {/* All Roadmaps Grid */}
          <section className="space-y-5">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-1.5 h-5 bg-cyan-500 rounded-full inline-block" />
              All Career Paths
            </h2>

            <div className="space-y-4">
              {roadmaps.map((roadmap, idx) => {
                const meta = roadmapMeta[idx % roadmapMeta.length];
                return (
                  <div
                    key={idx}
                    className="group p-6 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-11 h-11 rounded-xl ${meta.iconBg} flex items-center justify-center text-xl shrink-0`}
                      >
                        {meta.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1.5 gap-2">
                          <h3 className="text-lg font-bold group-hover:text-blue-500 transition-colors">
                            {roadmap.title}
                          </h3>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${meta.badgeBg}`}>
                              {meta.badge}
                            </span>
                            <ChevronRight
                              size={16}
                              className="text-blue-500 group-hover:translate-x-0.5 transition-transform"
                            />
                          </div>
                        </div>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3 leading-relaxed">
                          {roadmap.description}
                        </p>
                        <div className="flex items-center gap-5 text-xs text-zinc-500 dark:text-zinc-400">
                          <span className="flex items-center gap-1.5">
                            <BookOpen size={11} />
                            {roadmap.modules}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={11} />
                            {roadmap.duration}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users size={11} />
                            {roadmap.students}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

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
