import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-5 text-center">
      <span className="font-display text-6xl font-bold text-muted">404</span>
      <h1 className="font-display text-2xl font-bold text-fg">Page not found</h1>
      <p className="max-w-sm text-sm text-muted">
        This page doesn&apos;t exist or has been moved. The build log continues elsewhere.
      </p>
      <Link
        href="/"
        className="rounded-md bg-teal px-5 py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
      >
        Back to home
      </Link>
    </div>
  )
}
