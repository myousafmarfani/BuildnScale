import Link from 'next/link';
import Image from 'next/image';
import {
  Clock,
  Calendar,
  ArrowRight,
  Github,
  ExternalLink,
  Code2,
  Layers,
  Star,
  GitFork,
} from 'lucide-react';
import { projects } from '@/lib/data';
import { getAllPosts } from '@/lib/blog';
import { formatDate } from '@/lib/utils';
import BlogSidebar from '@/components/sidebar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | M. Yousuf',
  description:
    'Real-world AI-powered and full-stack projects built with Next.js, FastAPI, Python and more. Browse source code, tutorials, and detailed breakdowns.',
  openGraph: {
    title: 'Projects | M. Yousuf',
    description:
      'Real-world applications built from scratch. Source code, tutorials, and breakdowns — learn by building.',
    type: 'website',
  },
};

export default function ProjectsPage() {
  const allPosts = getAllPosts();
  const featuredProject = projects[0];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Page Header ──────────────────────────────────────────── */}
      <section className="pt-4 pb-12 border-b border-zinc-200 dark:border-zinc-800 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Code2 size={16} className="text-blue-500" />
          <span className="text-xs font-semibold tracking-widest uppercase text-blue-500">
            Projects
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Projects &amp; Builds
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl leading-relaxed">
          Real-world applications built from scratch. Source code, tutorials, and deep-dive
          breakdowns — learn by building.
        </p>
        <div className="flex flex-wrap items-center gap-6 mt-5 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Layers size={14} className="text-blue-500" />
            {projects.length} Projects
          </span>
          <span className="flex items-center gap-1.5">
            <Code2 size={14} className="text-blue-500" />
            Open Source
          </span>
          <span className="flex items-center gap-1.5">
            <Github size={14} className="text-blue-500" />
            <a
              href="https://github.com/myousafmarfani"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors"
            >
              github.com/myousafmarfani
            </a>
          </span>
        </div>
      </section>

      {/* ── Main Layout ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ── Left: Content ──────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-14">

          {/* Featured Project */}
          <section className="space-y-5">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-1.5 h-5 bg-blue-500 rounded-full inline-block" />
              Featured Project
            </h2>

            <a
              href={featuredProject.github || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/8 transition-all duration-300"
            >
              <div className="relative aspect-21/9 overflow-hidden">
                <Image
                  src={featuredProject.image}
                  alt={featuredProject.title}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />

                {/* Overlay content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/90 text-white font-semibold">
                      Featured
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white border border-white/20">
                      Open Source
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                    {featuredProject.title}
                  </h3>
                  <p className="text-sm text-zinc-300 line-clamp-2 max-w-xl">
                    {featuredProject.description}
                  </p>
                </div>

                <div className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink size={13} className="text-white" />
                </div>
              </div>

              <div className="p-5 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex flex-wrap gap-2">
                  {featuredProject.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                {featuredProject.github && (
                  <div className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400 ml-auto shrink-0">
                    <span className="flex items-center gap-1.5 hover:text-zinc-900 dark:hover:text-white transition-colors">
                      <Github size={14} />
                      View Code
                    </span>
                  </div>
                )}
              </div>
            </a>
          </section>

          {/* All Projects */}
          <section className="space-y-5">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-1.5 h-5 bg-cyan-500 rounded-full inline-block" />
              All Projects
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {projects.map((project, idx) => (
                <a
                  key={idx}
                  href={project.github || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                        <ExternalLink size={12} className="text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-bold leading-snug group-hover:text-blue-500 transition-colors line-clamp-1">
                      {project.title}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {project.tech.map((tech, ti) => (
                        <span
                          key={ti}
                          className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                      {project.github && (
                        <span className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                          <Github size={12} />
                          Source
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 text-xs text-zinc-400 ml-auto">
                        <Star size={11} className="text-yellow-500" />
                        Open Source
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* CTA to GitHub */}
            <a
              href="https://github.com/myousafmarfani"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <Github size={15} />
              View All on GitHub
              <GitFork size={13} className="ml-1 opacity-60" />
            </a>
          </section>

          {/* Project Tutorials */}
          {allPosts.length > 0 && (
            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-violet-500 rounded-full inline-block" />
                  Project Tutorials
                </h2>
                <Link
                  href="/blog"
                  className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
                >
                  Browse all <ArrowRight size={14} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {allPosts.map((post, idx) => (
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
            <BlogSidebar
              professionalCta={{
                title: 'Have a project in mind?',
                description:
                  'Looking for a freelance Full-Stack and AI developer to build, ship, or scale your product?',
                primaryLabel: 'Start a Project',
                primaryHref: '/contact',
                secondaryLabel: 'View Case Studies',
                secondaryHref: 'https://github.com/myousafmarfani',
              }}
            />
          </div>
        </aside>
      </div>
    </main>
  );
}
