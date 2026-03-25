import Link from 'next/link';
import {
  Mail,
  Globe,
  Calendar,
  Github,
  Linkedin,
  Twitter,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import type { Metadata } from 'next';
import ContactForm from '@/components/contact/ContactForm';
import ScheduleCallForm from '@/components/contact/ScheduleCallForm';
import { siteUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Contact | M. Yousuf',
  description:
    'Get in touch for freelance full-stack and AI projects, consulting, or collaborations.',
  openGraph: {
    title: 'Contact | M. Yousuf',
    description:
      'Reach out for full-stack and AI engineering projects, consulting, or collaborations.',
    type: 'website',
    url: `${siteUrl}/contact`,
  },
};

export default function ContactPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <section className="pt-4 pb-12 border-b border-zinc-200 dark:border-zinc-800 mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Mail size={16} className="text-blue-500" />
          <span className="text-xs font-semibold tracking-widest uppercase text-blue-500">
            Contact
          </span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Let&apos;s build something great
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl leading-relaxed">
              I help founders and teams ship full-stack and AI products with production-grade
              engineering. Share your goals and I will reply within 24-48 hours.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#schedule-call"
              className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition-colors"
            >
              Schedule a Call <ArrowRight size={14} />
            </a>
            <a
              href="mailto:contact@myousaf.dev"
              className="inline-flex items-center gap-2 rounded-full border border-blue-500 px-4 py-2 text-sm font-semibold text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
            >
              Email Me <Mail size={14} />
            </a>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10">
        <section className="space-y-6">
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Tell me about your project</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                Share scope, goals, and timelines. I will respond with next steps or a discovery
                call link.
              </p>
            </div>
            <ContactForm />
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 md:p-8 space-y-5">
            <h2 className="text-xl font-bold">Contact details</h2>
            <div className="space-y-3 text-sm text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-blue-500" />
                <a href="mailto:contact@myousaf.dev" className="hover:text-blue-500">
                  contact@myousaf.dev
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-blue-500" />
                <a href={siteUrl} className="hover:text-blue-500">
                  {siteUrl.replace('https://', '')}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-blue-500" />
                <span>Remote • PKT (UTC+5)</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-blue-500" />
                <a href="#schedule-call" className="hover:text-blue-500">Schedule a meeting</a>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 p-6 md:p-8 space-y-4">
            <h3 className="text-lg font-semibold">Connect on socials</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Follow for project updates, roadmap releases, and engineering notes.
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://github.com/myousafmarfani"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:border-blue-500 hover:text-blue-500 transition-colors"
              >
                <Github size={14} /> GitHub
              </a>
              <a
                href="https://linkedin.com/in/myousafmarfani"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:border-blue-500 hover:text-blue-500 transition-colors"
              >
                <Linkedin size={14} /> LinkedIn
              </a>
              <a
                href="https://x.com/myousafmarfani"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:border-blue-500 hover:text-blue-500 transition-colors"
              >
                <Twitter size={14} /> X / Twitter
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-blue-200/70 bg-linear-to-br from-white to-blue-50/70 dark:border-blue-900/40 dark:from-zinc-900/60 dark:to-blue-950/30 p-6 md:p-8 space-y-3">
            <h3 className="text-lg font-semibold">Need a quick estimate?</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Share the scope and I will send a rough estimate and timeline within 2 business days.
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View recent projects <ArrowRight size={14} />
            </Link>
          </div>
        </aside>
      </div>

      <section id="schedule-call" className="mt-10">
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Schedule a call</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Pick your preferred date and time, then share your context so we can make the call productive.
            </p>
          </div>
          <ScheduleCallForm />
        </div>
      </section>
    </main>
  );
}
