import type { ReactNode } from 'react';
import RoadmapBanner from '@/components/roadmaps/RoadmapBanner';
import RoadmapBackLink from '@/components/roadmaps/RoadmapBackLink';

export default function RoadmapsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <RoadmapBanner />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <RoadmapBackLink />
      </div>
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">{children}</main>
    </>
  );
}
