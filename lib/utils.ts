import { type ClassValue, clsx } from "clsx";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://buildnscale.vercel.app';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function extractHeadings(content: string) {
  const headingRegex = /^#{2,3}\s+(.+)$/gm;
  const headings: { text: string; level: number; id: string }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1];
    const level = match[0].split('#').length - 1;
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    headings.push({ text, level, id });
  }

  return headings;
}
