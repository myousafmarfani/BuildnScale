import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail, Rss } from 'lucide-react';
import ExternalLink from '@/components/external-link';

const footerSections = [
  {
    title: 'Blog',
    links: [
      { href: '/blog', label: 'All Articles' },
      { href: '/roadmaps', label: 'Learning Roadmaps' },
      { href: '/search', label: 'Search Articles' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { href: '/projects', label: 'Projects & Builds' },
      { href: '/resources', label: 'Recommended Tools' },
      { href: '/contact', label: 'Contact' },
      { href: '/author', label: 'About the Author' },
      { href: 'https://github.com/myousafmarfani', label: 'GitHub Profile', external: true },
    ],
  },
  {
    title: 'Services',
    links: [
      { href: 'https://www.fiverr.com/yousaf_codes', label: 'Fiverr Profile', external: true },
      { href: 'https://www.fiverr.com/yousaf_codes', label: 'AI Chatbot Development', external: true },
      { href: 'https://www.fiverr.com/yousaf_codes', label: 'Full-Stack Web Apps', external: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-20 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Brand column (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-5">
            <Link
              href="/"
              className="flex items-center gap-0.5 shrink-0 tracking-tight select-none"
              style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: '1.25rem' }}
            >
              <span className="text-blue-500">Build</span>
              <span className="text-zinc-400 dark:text-zinc-500 font-medium text-base mx-0.5">n</span>
              <span className="text-zinc-900 dark:text-white">Scale</span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
              BuildnScale is a technical learning platform focused on Full-Stack Development and
              Agentic AI engineering. Explore production-ready tutorials, roadmaps, and developer
              resources for modern web and AI systems.
            </p>
            <div className="flex items-center gap-2">
              <ExternalLink
                href="https://github.com/myousafmarfani"
                aria-label="GitHub"
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
              >
                <Github size={16} />
              </ExternalLink>
              <ExternalLink
                href="https://linkedin.com/in/myousafmarfani"
                aria-label="LinkedIn"
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
              >
                <Linkedin size={16} />
              </ExternalLink>
              <ExternalLink
                href="https://x.com/myousafmarfani"
                aria-label="X / Twitter"
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
              >
                <Twitter size={16} />
              </ExternalLink>
              <a
                href="mailto:contact@myousaf.dev"
                aria-label="Email"
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
              >
                <Mail size={16} />
              </a>
              <Link
                href="/sitemap.xml"
                aria-label="RSS / Sitemap"
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
              >
                <Rss size={16} />
              </Link>
            </div>
          </div>

          {/* Link sections */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-bold text-sm text-zinc-900 dark:text-white tracking-wide">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {'external' in link && link.external ? (
                      <ExternalLink
                        href={link.href}
                        className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                      >
                        {link.label} ↗
                      </ExternalLink>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-200 dark:border-zinc-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-400">
            © 2026 Build n Scale. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/contact" className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
              Contact
            </Link>
            <Link href="/author" className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
              Author
            </Link>
            <Link href="/resources" className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
              Affiliate Disclosure
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
