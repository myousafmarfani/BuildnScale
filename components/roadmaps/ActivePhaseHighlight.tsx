'use client';

import { useEffect, useRef } from 'react';

type ActivePhaseHighlightProps = {
  children: React.ReactNode;
};

export default function ActivePhaseHighlight({ children }: ActivePhaseHighlightProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = rootRef.current;
    if (!container) {
      return;
    }

    const links = Array.from(container.querySelectorAll('a[href^="#phase-"]'));
    if (!links.length) {
      return;
    }

    const headingNodes = Array.from(
      document.querySelectorAll<HTMLHeadingElement>('h2[data-phase-heading="true"]')
    );

    if (!headingNodes.length) {
      return;
    }

    const clearActive = () => {
      for (const link of links) {
        link.setAttribute('data-active', 'false');
      }
    };

    clearActive();

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (!visible.length) {
          return;
        }

        const id = visible[0].target.getAttribute('id');
        if (!id) {
          return;
        }

        clearActive();
        const activeLink = container.querySelector<HTMLAnchorElement>(`a[href="#${id}"]`);
        if (activeLink) {
          activeLink.setAttribute('data-active', 'true');
        }
      },
      {
        threshold: 0.3,
      }
    );

    for (const heading of headingNodes) {
      observer.observe(heading);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
