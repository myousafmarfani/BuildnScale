'use client';

import { useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CodeBlock({
  children,
  ...props
}: React.HTMLAttributes<HTMLPreElement>) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = preRef.current?.textContent ?? '';
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for insecure contexts
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative group/code">
      <pre ref={preRef} {...props}>
        {children}
      </pre>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        aria-label={copied ? 'Copied!' : 'Copy code'}
        className="group/btn absolute top-3 right-3 flex items-center justify-center w-7 h-7 rounded-lg
          bg-zinc-700/70 hover:bg-zinc-600/90 border border-zinc-600/50
          text-zinc-300 hover:text-white
          opacity-0 group-hover/code:opacity-100 focus:opacity-100
          transition-all duration-150"
      >
        {/* Tooltip — only visible when hovering the button itself */}
        <span
          className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2
            px-2 py-1 rounded-md text-[11px] font-medium whitespace-nowrap
            bg-zinc-800 text-zinc-100 border border-zinc-700
            opacity-0 group-hover/btn:opacity-100
            transition-opacity duration-150 select-none"
        >
          {copied ? 'Copied!' : 'Copy'}
          {/* Tooltip arrow */}
          <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-zinc-800" />
        </span>

        {copied ? (
          <Check size={13} className="text-green-400" />
        ) : (
          <Copy size={13} />
        )}
      </button>
    </div>
  );
}
