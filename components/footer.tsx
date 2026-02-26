import Link from 'next/link';
import { Github, Linkedin, Twitter, Mail, Rss } from 'lucide-react';

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
      { href: '/author', label: 'About the Author' },
      { href: 'https://github.com/myousafmarfani', label: 'GitHub Profile', external: true },
    ],
  },
  {
    title: 'Services',
    links: [
      { href: 'https://www.fiverr.com/myousaf_codes', label: 'Fiverr Gigs', external: true },
      { href: 'https://www.fiverr.com/myousaf_codes/develop-ai-powered-chatbot', label: 'AI Chatbots', external: true },
      { href: 'https://www.fiverr.com/myousaf_codes/build-fullstack-web-app', label: 'Web Apps', external: true },
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
            <Link href="/" className="text-2xl font-bold flex items-center gap-1.5">
              <span className="text-blue-500">M.</span>
              <span>Yousuf</span>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
              Full-Stack Developer & AI Enthusiast. Writing about Next.js, FastAPI, and Agentic AI
              from production experience.
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/myousafmarfani"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
              >
                <Github size={16} />
              </a>
              <a
                href="https://linkedin.com/in/myousafmarfani"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="https://x.com/myousaf_codes"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter"
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
              >
                <Twitter size={16} />
              </a>
              <a
                href="mailto:contact@myousaf.dev"
                aria-label="Email"
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
              >
                <Mail size={16} />
              </a>
              <a
                href="/sitemap.xml"
                aria-label="RSS / Sitemap"
                className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
              >
                <Rss size={16} />
              </a>
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
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                      >
                        {link.label} ↗
                      </a>
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
            © 2026 M. Yousuf. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
              Terms of Use
            </a>
            <a href="#" className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
              Affiliate Disclosure
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
