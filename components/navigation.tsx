'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  // atTop  → user is at very top of page → flat border-b style
  // hidden → scrolling down → slide offscreen
  // floating (neither atTop nor hidden) → scrolling up but not at top → rounded glass style
  const [atTop, setAtTop] = useState(true);
  const [hidden, setHidden] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // Hydration guard for theme
  useEffect(() => setMounted(true), []);

  // Scroll listener — hide on scroll-down, show rounded on scroll-up, flat at top
  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const atTopNow = y <= 10;
      const scrollingDown = y > lastY;

      setAtTop(atTopNow);

      if (atTopNow) {
        // Back at very top — always show flat style
        setHidden(false);
      } else if (scrollingDown) {
        // Scrolling down — hide
        setHidden(true);
      } else {
        // Scrolling up, not at top — show with rounded/float style
        setHidden(false);
      }

      lastY = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [pathname]);

  const navLinks = [
    { href: '/blog', label: 'Blog' },
    { href: '/roadmaps', label: 'Roadmaps' },
    { href: '/projects', label: 'Projects' },
    { href: '/resources', label: 'Resources' },
  ];

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <>
      {/* ── Nav bar ─────────────────────────────────────────────── */}
      <nav
        className={`fixed z-50 transition-all duration-300 ease-in-out ${
          hidden
            ? '-translate-y-full opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100'
        } ${
          atTop
            ? 'inset-x-0 top-0 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800'
            : 'inset-x-3 sm:inset-x-6 top-3 rounded-2xl bg-white/85 dark:bg-zinc-950/85 backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-700/40 shadow-xl shadow-black/[0.07]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-0.5 shrink-0 tracking-tight select-none"
              style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: '1.2rem' }}
            >
              <span className="text-blue-500">Build</span>
              <span className="text-zinc-400 dark:text-zinc-500 font-medium text-base mx-0.5">n</span>
              <span className="text-zinc-900 dark:text-white">Scale</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      isActive
                        ? 'text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 font-medium'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Link
                href="/search"
                className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Search"
              >
                <Search size={17} />
              </Link>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Toggle theme"
              >
                {!mounted ? (
                  <div className="w-4.25 h-4.25" />
                ) : theme === 'dark' ? (
                  <Sun size={17} />
                ) : (
                  <Moon size={17} />
                )}
              </button>
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Open menu"
              >
                <Menu size={17} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Sheet (slide from right) ─────────────────────── */}
      {/* Backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-60 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-70 w-72 bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-zinc-200 dark:border-zinc-800">
          <Link
            href="/"
            className="flex items-center gap-0.5 tracking-tight select-none"
            style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: '1.2rem' }}
            onClick={() => setMobileOpen(false)}
          >
            <span className="text-blue-500">Build</span>
            <span className="text-zinc-400 dark:text-zinc-500 font-medium text-base mx-0.5">n</span>
            <span className="text-zinc-900 dark:text-white">Scale</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close menu"
          >
            <X size={17} />
          </button>
        </div>

        {/* Panel nav links */}
        <nav className="flex flex-col py-4 px-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/search"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all mt-1"
          >
            <Search size={15} />
            Search
          </Link>
        </nav>

        {/* Panel footer — theme toggle */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-5 border-t border-zinc-200 dark:border-zinc-800">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-sm font-medium"
          >
            <span>{mounted && theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            {!mounted ? (
              <div className="w-4.25 h-4.25" />
            ) : theme === 'dark' ? (
              <Sun size={17} />
            ) : (
              <Moon size={17} />
            )}
          </button>
        </div>
      </div>
    </>
  );
}
