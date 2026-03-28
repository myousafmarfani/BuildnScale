'use client';

import Link from 'next/link';
import { Mail, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import ExternalLink from '@/components/external-link';

type RoadmapSidebarItem = {
  title: string;
  description: string;
  href: string;
  meta?: string;
};

type ResourceSidebarItem = {
  name: string;
  description: string;
  href: string;
  tag?: string;
};

type BlogSidebarProps = {
  roadmapCta?: React.ReactNode;
  roadmaps?: RoadmapSidebarItem[];
  resources?: ResourceSidebarItem[];
  professionalCta?: {
    title: string;
    description: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  };
};

export default function BlogSidebar({
  roadmapCta,
  roadmaps,
  resources,
  professionalCta,
}: BlogSidebarProps) {
  const isExternalHref = (href: string) => href.startsWith('http://') || href.startsWith('https://');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      let data: { success?: boolean; message?: string; error?: string } = {};
      try {
        data = (await response.json()) as { success?: boolean; message?: string; error?: string };
      } catch {
        data = {};
      }

      if (response.ok && data.success) {
        setMessage(data.message || 'Thanks. You are subscribed to the newsletter.');
        setEmail('');
      } else {
        setIsError(true);
        setMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch {
      setIsError(true);
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {roadmapCta}

      {/* Newsletter */}
      <div className="bg-zinc-50 dark:bg-zinc-900/70 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Mail size={15} className="text-blue-500" />
          </div>
          <h3 className="font-bold text-base">Newsletter</h3>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Get the latest posts and insights on AI development delivered to your inbox weekly.
          No spam, ever.
        </p>
        <form onSubmit={handleSubscribe} className="space-y-3">
          <label htmlFor="sidebar-newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="sidebar-newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            suppressHydrationWarning
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder-zinc-400 transition"
          />
          <button
            type="submit"
            disabled={isLoading}
            suppressHydrationWarning
            className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Subscribing…' : 'Subscribe — It\'s Free'}
          </button>
        </form>
        {message ? (
          <p className={`text-xs font-medium ${isError ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        ) : null}
      </div>

      {roadmaps && roadmaps.length > 0 && (
        <div className="bg-zinc-50 dark:bg-zinc-900/70 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 space-y-4">
          <h3 className="font-bold text-base">Roadmaps</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Structured paths to build full-stack, AI, and cloud skills.
          </p>
          <div className="space-y-3">
            {roadmaps.map((roadmap) => (
              <Link
                key={roadmap.href}
                href={roadmap.href}
                className="block border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 hover:border-blue-500/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                      {roadmap.title}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                      {roadmap.description}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-blue-500 shrink-0">
                    {roadmap.meta || 'Explore'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/roadmaps"
            className="flex items-center justify-center gap-1.5 w-full border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
          >
            View All Roadmaps <ChevronRight size={14} />
          </Link>
        </div>
      )}

      {resources && resources.length > 0 && (
        <div className="bg-zinc-50 dark:bg-zinc-900/70 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 space-y-4">
          <h3 className="font-bold text-base">Resources</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Curated tools, platforms, and references to ship faster.
          </p>
          <div className="space-y-3">
            {resources.map((resource) => (
              <ExternalLink
                key={resource.href}
                href={resource.href}
                className="block border border-zinc-200 dark:border-zinc-700 rounded-xl p-3 hover:border-blue-500/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                      {resource.name}
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                      {resource.description}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-blue-500 shrink-0">
                    {resource.tag || 'Open'}
                  </span>
                </div>
              </ExternalLink>
            ))}
          </div>
          <Link
            href="/resources"
            className="flex items-center justify-center gap-1.5 w-full border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
          >
            View All Resources <ChevronRight size={14} />
          </Link>
        </div>
      )}

      {professionalCta && (
        <div className="bg-zinc-50 dark:bg-zinc-900/70 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-base">{professionalCta.title}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {professionalCta.description}
            </p>
          </div>
          <div className="space-y-2">
            {isExternalHref(professionalCta.primaryHref) ? (
              <ExternalLink
                href={professionalCta.primaryHref}
                className="flex items-center justify-center gap-1.5 w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                {professionalCta.primaryLabel}
                <ChevronRight size={14} />
              </ExternalLink>
            ) : (
              <Link
                href={professionalCta.primaryHref}
                className="flex items-center justify-center gap-1.5 w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                {professionalCta.primaryLabel}
                <ChevronRight size={14} />
              </Link>
            )}
            {professionalCta.secondaryLabel && professionalCta.secondaryHref && (
              isExternalHref(professionalCta.secondaryHref) ? (
                <ExternalLink
                  href={professionalCta.secondaryHref}
                  className="flex items-center justify-center gap-1.5 w-full border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-500 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                >
                  {professionalCta.secondaryLabel}
                </ExternalLink>
              ) : (
                <Link
                  href={professionalCta.secondaryHref}
                  className="flex items-center justify-center gap-1.5 w-full border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:border-blue-500 hover:text-blue-500 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                >
                  {professionalCta.secondaryLabel}
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

