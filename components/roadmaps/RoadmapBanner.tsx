'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

const KEY = 'roadmap_banner_v2_dismissed';

export default function RoadmapBanner() {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }

    return localStorage.getItem(KEY) === 'true';
  });
  const showOnThisPage = pathname === '/roadmaps';

  if (!showOnThisPage || dismissed) {
    return null;
  }

  return (
    <div className="relative w-full bg-primary/10 py-2.5 px-4 pr-10 text-center text-sm text-foreground">
      <p>Two roadmaps are now live: Full-Stack Web Developer and AI Engineer. Both are free.</p>
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => {
          localStorage.setItem(KEY, 'true');
          setDismissed(true);
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2"
      >
        ×
      </button>
    </div>
  );
}
