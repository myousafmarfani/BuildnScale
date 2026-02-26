'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface ScrollAwareSidebarProps {
  children: ReactNode;
  className?: string;
  /**
   * Distance (px) from the top of the viewport the sidebar should stop at
   * when sticking at the top. Should match your nav height + breathing room.
   * Default: 88 (nav h-16 = 64 + top-3 = 12 + 12px buffer)
   */
  topOffset?: number;
}

/**
 * Scroll-aware sticky sidebar.
 *
 * Behaviour:
 *  - Sidebar shorter than viewport → classic sticky at top (topOffset).
 *  - Sidebar taller than viewport →
 *      scrolling DOWN  : sidebar scrolls until its bottom hits the viewport bottom, then locks.
 *      scrolling UP    : sidebar scrolls until its top hits topOffset, then locks.
 *
 * This is achieved by keeping `position: sticky` the whole time and continuously
 * adjusting the `top` value so the browser honours the clamp precisely.
 */
export default function ScrollAwareSidebar({
  children,
  className = '',
  topOffset = 88,
}: ScrollAwareSidebarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const currentTop = useRef(topOffset); // tracks the live `top` px value

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Initialise
    lastScrollY.current = window.scrollY;
    el.style.top = `${topOffset}px`;

    const onScroll = () => {
      if (!el) return;

      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollY.current;
      lastScrollY.current = scrollY;

      const viewportH = window.innerHeight;
      const sidebarH = el.offsetHeight;

      if (sidebarH + topOffset <= viewportH) {
        // Sidebar fits entirely in viewport — just stick at top.
        currentTop.current = topOffset;
        el.style.top = `${topOffset}px`;
        return;
      }

      // Sidebar taller than viewport: scroll-aware clamping.
      // maxTop: sidebar top aligned with topOffset (can't go higher)
      // minTop: sidebar bottom aligned with viewport bottom
      const maxTop = topOffset;
      const minTop = viewportH - sidebarH;

      let newTop = currentTop.current - delta;
      newTop = Math.max(minTop, Math.min(maxTop, newTop));

      currentTop.current = newTop;
      el.style.top = `${newTop}px`;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [topOffset]);

  return (
    <div
      ref={ref}
      className={`sticky ${className}`}
      style={{ top: topOffset }}
    >
      {children}
    </div>
  );
}
