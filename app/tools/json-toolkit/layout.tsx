import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Free JSON Formatter & Validator | BuildnScale',
  description:
    'Format, validate, and minify JSON in your browser. Copy or download the result. No account or upload required.',
  alternates: { canonical: 'https://www.buildnscale.dev/tools/json-toolkit' },
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
