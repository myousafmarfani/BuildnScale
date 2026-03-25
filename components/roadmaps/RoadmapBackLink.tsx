'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function RoadmapBackLink() {
  const pathname = usePathname();
  const show = pathname.startsWith('/roadmaps/') && pathname !== '/roadmaps';

  if (!show) {
    return null;
  }

  return (
    <Link
      href="/roadmaps"
      className="flex w-full max-w-7xl items-center gap-1 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      ← All Roadmaps
    </Link>
  );
}
