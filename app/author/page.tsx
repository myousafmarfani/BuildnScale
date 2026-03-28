import Link from 'next/link';
import {
  Github,
  Linkedin,
  Twitter,
  MapPin,
  Calendar,
  BookOpen,
  Code2,
  Cpu,
  Server,
  Globe,
  Layers,
  ArrowRight,
  ExternalLink,
  GraduationCap,
  Zap,
  Clock,
} from 'lucide-react';
import { getAllPosts } from '@/lib/blog';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'About - M. Yousaf Marfani, Full-Stack & AI Engineer',
  description:
    'M. Yousaf Marfani is a Full-Stack Developer and AI Engineer specialising in Next.js, FastAPI, LangChain, and Agentic AI systems. Writing at BuildnScale.',
  alternates: { canonical: 'https://www.buildnscale.dev/author' },
};

const skills = [
  {
    icon: Globe,
    label: 'Frontend',
    items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
  },
  {
    icon: Server,
    label: 'Backend',
    items: ['FastAPI', 'Python', 'Node.js', 'REST APIs'],
  },
  {
    icon: Cpu,
    label: 'AI / ML',
    items: ['LangChain', 'OpenAI', 'Agentic AI', 'RAG Pipelines'],
  },
  {
    icon: Layers,
    label: 'DevOps & DB',
    items: ['Docker', 'PostgreSQL', 'MongoDB', 'Vercel'],
  },
];

const timeline = [
  {
    year: '2024 – Present',
    role: 'Full-Stack × AI Developer',
    place: 'Freelance & Open-Source',
    description:
      'Building production-ready applications with Next.js, FastAPI, and agentic AI systems. Publishing in-depth tutorials covering architecture through deployment.',
  },
  {
    year: '2023 – Present',
    role: 'Student — Cloud Applied Generative AI',
    place: 'GIAIC (Governor Initiative for AI & Computing)',
    description:
      'Intensive programme covering modern AI engineering, cloud-native development, and full-stack application design.',
  },
  {
    year: '2022',
    role: 'Started Web Development',
    place: 'Self-Taught',
    description:
      'Began the journey with HTML/CSS/JS, progressed to React, then Next.js. Fell in love with building great user experiences.',
  },
];

export default function AuthorPage() {
  const allPosts = getAllPosts();
  const recentPosts = allPosts.slice(0, 4);
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'M. Yousaf Marfani',
    url: 'https://www.buildnscale.dev/author',
    sameAs: [
      'https://github.com/myousafmarfani',
      'https://www.fiverr.com/yousaf_codes',
    ],
    jobTitle: 'Full-Stack and Agentic AI Engineer',
    knowsAbout: [
      'Next.js',
      'FastAPI',
      'TypeScript',
      'Python',
      'LangChain',
      'RAG pipelines',
      'Agentic AI systems',
      'Full-Stack Development',
    ],
    description:
      'Full-stack and AI engineer focused on production systems with Next.js, FastAPI, and agentic AI architecture.',
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
      <JsonLd data={personSchema} />

      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section className="flex flex-col md:flex-row items-start gap-10 md:gap-14 pt-4">

        {/* Avatar */}
        <div className="shrink-0 mx-auto md:mx-0">
          <div className="relative">
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full bg-linear-to-br from-blue-500 via-cyan-400 to-blue-600 blur-xl opacity-30 scale-110" />
            <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-5xl font-extrabold select-none ring-4 ring-white dark:ring-zinc-950 shadow-xl">
              MY
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 text-center md:text-left">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-500 mb-4 bg-blue-500/10 px-3 py-1 rounded-full">
            Full-Stack × AI
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight mb-4">
            M. Yousaf Marfani
            <span className="block text-2xl md:text-3xl font-semibold text-zinc-500 dark:text-zinc-400 mt-2 tracking-normal">
              Building{' '}
            <span className="bg-linear-to-r from-blue-500 via-cyan-400 to-blue-600 text-transparent bg-clip-text">
                AI-Powered
              </span>{' '}
              Full-Stack Apps
            </span>
          </h1>
          <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed mb-6">
            Deep-dive tutorials on Next.js, FastAPI, and Agentic AI — from architecture to
            production-ready deployment. Student at{' '}
            <span className="text-blue-500 font-medium">GIAIC</span>, learning ML, DL &amp;
            modern AI engineering.
          </p>

          {/* Meta chips */}
          <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-blue-500" />
              Pakistan
            </span>
            <span className="flex items-center gap-1.5">
              <GraduationCap size={13} className="text-blue-500" />
              GIAIC Student
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen size={13} className="text-blue-500" />
              {allPosts.length} articles published
            </span>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <a
              href="https://github.com/myousafmarfani"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:border-blue-500/60 hover:text-blue-500 transition-all"
            >
              <Github size={15} />
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/myousafmarfani"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:border-blue-500/60 hover:text-blue-500 transition-all"
            >
              <Linkedin size={15} />
              LinkedIn
            </a>
            <a
              href="https://x.com/myousafmarfani"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:border-blue-500/60 hover:text-blue-500 transition-all"
            >
              <Twitter size={15} />
              Twitter / X
            </a>
          </div>
        </div>
      </section>

      {/* ─── Stats row ────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { value: `${allPosts.length}+`, label: 'Articles Published', icon: BookOpen },
          { value: '2+', label: 'Years Building', icon: Code2 },
          { value: '4+', label: 'Tech Stacks', icon: Layers },
          { value: '∞', label: 'Things to Learn', icon: Zap },
        ].map(({ value, label, icon: Icon }) => (
          <div
            key={label}
            className="flex flex-col items-center text-center p-5 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800"
          >
            <Icon size={18} className="text-blue-500 mb-2" />
            <span className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white">
              {value}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-snug">{label}</span>
          </div>
        ))}
      </section>

      {/* ─── About ────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Code2 size={15} className="text-blue-500" />
          </span>
          <h2 className="text-2xl font-bold">About Me</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 text-zinc-600 dark:text-zinc-400 leading-relaxed text-[0.95rem]">
          <p>
            I&apos;m a self-driven Full-Stack Developer passionate about building tools that
            actually matter. My focus sits at the intersection of modern web engineering and
            applied AI — specifically crafting{' '}
            <span className="text-zinc-900 dark:text-zinc-200 font-medium">
              production-ready applications
            </span>{' '}
            with Next.js on the frontend and FastAPI on the backend, glued together with
            agentic AI systems.
          </p>
          <p>
            Currently studying{' '}
            <span className="text-zinc-900 dark:text-zinc-200 font-medium">
              Cloud Applied Generative AI Engineering
            </span>{' '}
            at GIAIC, I document everything I learn along the way — from architecture
            decisions and system design to deployment pipelines and AI integration patterns.
            Every article is a deep dive, not a surface-level overview.
          </p>
        </div>
      </section>

      {/* ─── Skills grid ──────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Cpu size={15} className="text-blue-500" />
          </span>
          <h2 className="text-2xl font-bold">Tech Stack</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map(({ icon: Icon, label, items }) => (
            <div
              key={label}
              className="p-5 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 space-y-3 hover:border-blue-500/40 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon size={15} className="text-blue-500" />
                <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  {label}
                </span>
              </div>
              <ul className="space-y-1.5">
                {items.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Timeline ─────────────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Calendar size={15} className="text-blue-500" />
          </span>
          <h2 className="text-2xl font-bold">Journey</h2>
        </div>
        <div className="relative space-y-0">
          {/* Vertical line */}
          <div className="absolute left-4.5 top-3 bottom-3 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
          {timeline.map((item, idx) => (
            <div key={idx} className="relative flex gap-5 sm:gap-8 pb-8 last:pb-0">
              {/* Dot */}
              <div className="hidden sm:flex shrink-0 w-9 h-9 rounded-full items-center justify-center bg-white dark:bg-zinc-950 border-2 border-blue-500 z-10 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              </div>
              <div className="flex-1 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-blue-500/40 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
                  <h3 className="font-bold text-zinc-900 dark:text-white">{item.role}</h3>
                  <span className="text-xs text-blue-500 font-semibold bg-blue-500/10 px-2.5 py-1 rounded-full shrink-0">
                    {item.year}
                  </span>
                </div>
                <p className="text-xs font-medium text-zinc-400 mb-2">{item.place}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Recent Articles ──────────────────────────────────────── */}
      {recentPosts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <BookOpen size={15} className="text-blue-500" />
              </span>
              <h2 className="text-2xl font-bold">Recent Articles</h2>
            </div>
            <Link
              href="/blog"
              className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1 transition-colors"
            >
              All articles
              <ArrowRight size={13} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {recentPosts.map((post, idx) => (
              <Link
                key={idx}
                href={`/blog/${post.slug}`}
                className="group flex gap-4 p-4 bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all"
              >
                <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-zinc-200 dark:bg-zinc-800">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="text-sm font-bold leading-snug group-hover:text-blue-500 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 pt-0.5">
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

      {/* ─── CTA / Contact ────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-8 md:p-12">
        {/* Background accent */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <h2 className="text-2xl md:text-3xl font-extrabold">
              Want to work together{' '}
              <span className="bg-linear-to-r from-blue-500 via-cyan-400 to-blue-600 text-transparent bg-clip-text">
                or just chat?
              </span>
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              I&apos;m open to freelance projects, collaborations, and interesting conversations
              about full-stack development and AI. Reach out on any of the platforms below.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="https://github.com/myousafmarfani"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Github size={15} />
              GitHub
              <ExternalLink size={12} className="opacity-60" />
            </a>
            <a
              href="https://linkedin.com/in/myousafmarfani"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-blue-500 text-blue-500 text-sm font-semibold hover:bg-blue-500 hover:text-white transition-all"
            >
              <Linkedin size={15} />
              LinkedIn
              <ExternalLink size={12} className="opacity-60" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
