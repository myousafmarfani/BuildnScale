'use client';

import { useMemo, useRef, useState } from 'react';

type RoadmapCodeBlockProps = React.HTMLAttributes<HTMLPreElement> & {
  children?: React.ReactNode;
};

export default function CodeBlock({ children, ...props }: RoadmapCodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const language = useMemo(() => {
    const node = children as { props?: { className?: string } } | undefined;
    const className = node?.props?.className ?? '';
    const match = /language-([\w-]+)/.exec(className);
    return match?.[1] ?? 'text';
  }, [children]);

  const onCopy = async () => {
    const raw = preRef.current?.textContent ?? '';
    if (!raw) {
      return;
    }

    await navigator.clipboard.writeText(raw);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-border">
      <div className="flex items-center justify-between bg-muted px-4 py-2 text-xs">
        <span className="font-mono">{language}</span>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Copy code"
        >
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
      <pre
        ref={preRef}
        {...props}
        className="overflow-x-auto bg-zinc-950 p-4 text-sm text-zinc-100 [&_code]:bg-transparent [&_code]:p-0"
      >
        {children}
      </pre>
    </div>
  );
}
