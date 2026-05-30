import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tools for developers | buildnscale.dev',
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children
}
