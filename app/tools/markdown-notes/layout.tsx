import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Markdown Notes — Free note-taking tool for developers | buildnscale.dev',
}

export default function MarkdownNotesLayout({ children }: { children: React.ReactNode }) {
  return children
}
