import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — Writing while building | buildnscale.dev',
  description:
    'Tactics, lessons, and tool updates for developers who actually ship. No fluff, just technical growth.',
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
