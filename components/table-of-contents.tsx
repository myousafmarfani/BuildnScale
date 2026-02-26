'use client';

import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronRight } from 'lucide-react';

interface Heading {
  text: string;
  level: number;
  id: string;
}

interface HeadingNode {
  heading: Heading;
  children: Heading[];
}

interface TableOfContentsProps {
  headings: Heading[];
}

function buildTree(headings: Heading[]): HeadingNode[] {
  const tree: HeadingNode[] = [];
  for (const h of headings) {
    if (h.level === 2) {
      tree.push({ heading: h, children: [] });
    } else if (h.level === 3) {
      if (tree.length > 0) {
        tree[tree.length - 1].children.push(h);
      } else {
        // Orphan H3 – treat as a root node
        tree.push({ heading: h, children: [] });
      }
    }
    // h4+ are ignored (edge case protection)
  }
  return tree;
}

function getInitialExpandedState(
  tree: HeadingNode[],
  totalCount: number
): Record<string, boolean> {
  // Auto-collapse nested sections when there are more than 10 headings
  const collapsed = totalCount > 10;
  const state: Record<string, boolean> = {};
  for (const node of tree) {
    state[node.heading.id] = !collapsed;
  }
  return state;
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const tree = buildTree(headings);

  const [isContentsOpen, setIsContentsOpen] = useState(true);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    getInitialExpandedState(tree, headings.length)
  );

  if (headings.length === 0) return null;

  const toggleSection = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="select-none">
      {/* ── CONTENTS header: click to collapse / expand the whole section ── */}
      <button
        onClick={() => setIsContentsOpen((v) => !v)}
        className="flex items-center gap-1.5 w-full text-left mb-3 group"
        aria-expanded={isContentsOpen}
      >
        <BookOpen size={13} className="text-zinc-400 shrink-0" />
        <span className="font-bold text-xs uppercase tracking-widest text-zinc-400">
          Contents
        </span>
        <ChevronDown
          size={12}
          className={`ml-auto text-zinc-400 transition-transform duration-200 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 ${
            isContentsOpen ? 'rotate-0' : '-rotate-90'
          }`}
        />
      </button>

      {/* ── Tree nav ── */}
      {isContentsOpen && (
        <nav aria-label="Table of contents" className="space-y-0.5">
          {tree.map((node) => {
            const hasChildren = node.children.length > 0;
            const isExpanded = expanded[node.heading.id] ?? true;

            return (
              <div key={node.heading.id}>
                {/* H2 row (toggle button + link) */}
                <div className="flex items-start gap-1">
                  {/* Expand / collapse arrow – only shown when there are children */}
                  {hasChildren ? (
                    <button
                      onClick={() => toggleSection(node.heading.id)}
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
                      className="mt-1.75 shrink-0 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                    >
                      <ChevronRight
                        size={11}
                        className={`transition-transform duration-200 ${
                          isExpanded ? 'rotate-90' : 'rotate-0'
                        }`}
                      />
                    </button>
                  ) : (
                    /* Spacer keeps alignment consistent */
                    <span className="inline-block w-2.75 shrink-0" />
                  )}

                  <a
                    href={`#${node.heading.id}`}
                    className="flex-1 min-w-0 py-1 text-sm leading-snug font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                  >
                    {node.heading.text}
                  </a>
                </div>

                {/* H3 children – animated open/close */}
                {hasChildren && (
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      isExpanded ? 'max-h-250 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="ml-3 pl-3 border-l border-zinc-200 dark:border-zinc-800 py-0.5 space-y-0.5">
                      {node.children.map((child) => (
                        <a
                          key={child.id}
                          href={`#${child.id}`}
                          className="block py-0.5 text-xs leading-snug text-zinc-500 dark:text-zinc-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                        >
                          {child.text}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      )}
    </div>
  );
}
