import Link from 'next/link'
export function CurrentCoverage() {
  return (
    <section
      className="rounded-2xl border border-border-strong bg-surface p-6 sm:p-10"
      aria-label="Current benchmark coverage"
    >
      <p className="eyebrow">CURRENT COVERAGE</p>
      <h2 className="mt-4 text-2xl font-semibold">
        Current rankings are not available yet.
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
        We are updating this dataset. Historical evaluations remain available in
        the archive, with their original dates. They are not substituted for
        current model rankings.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link className="btn-secondary" href="/leaderboard/archive">
          Browse the historical archive →
        </Link>
        <Link className="btn-secondary" href="/leaderboard/methodology">
          How we source results
        </Link>
      </div>
    </section>
  )
}
