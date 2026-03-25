'use client';

import { useMemo, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

type Props = React.HTMLAttributes<HTMLPreElement> & {
  children?: React.ReactNode;
};

export default function RoadmapCodeBlock({ children, ...props }: Props) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const language = useMemo(() => {
    const node = children as { props?: { className?: string } } | undefined;
    const className = node?.props?.className ?? '';
    const match = /language-([\w-]+)/.exec(className);
    return match?.[1] ?? 'code';
  }, [children]);

  const copy = async () => {
    const text = preRef.current?.textContent ?? '';
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="group relative my-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-100/80 px-3 py-2 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        <span>{language}</span>
        <button type="button" onClick={copy} className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-zinc-200 dark:hover:bg-zinc-800" aria-label="Copy code">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre ref={preRef} {...props} className="overflow-x-auto bg-zinc-950 p-4 text-zinc-100">
        {children}
      </pre>
    </div>
  );
}
