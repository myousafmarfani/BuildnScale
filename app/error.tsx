'use client'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-5 text-center">
      <span className="font-display text-5xl font-bold text-danger">!</span>
      <h1 className="font-display text-2xl font-bold text-fg">Something went wrong</h1>
      <p className="max-w-sm text-sm text-muted">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="rounded-md bg-teal px-5 py-2.5 text-sm font-semibold text-bg transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </div>
  )
}
