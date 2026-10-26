// Historical data is available only through an explicit archive selection.
/** @param {import('./types').Snapshot[]} snapshots @param {unknown} [requestedSource] */
export function selectSnapshot(snapshots, requestedSource) {
  const source =
    requestedSource === 'evalplus' ? 'evalplus' : requestedSource === 'artificial-analysis' ? 'artificial-analysis' : 'arena'
  return snapshots.find((snapshot) => snapshot.source === source) || null
}
/** @param {import('./types').Snapshot[]} snapshots @param {string[]} [selectedIds] @param {unknown} [requestedSource] */
export function comparisonSnapshots(
  snapshots,
  selectedIds = [],
  requestedSource
) {
  if (requestedSource === 'evalplus' || requestedSource === 'artificial-analysis')
    return snapshots.filter((s) => s.source === requestedSource)
  const hasExplicitOtherSelection = snapshots.some(
    (s) =>
      s.source !== 'arena' &&
      s.models.some((m) => selectedIds.includes(m.id))
  )
  return hasExplicitOtherSelection
    ? snapshots
    : snapshots.filter((s) => s.source === 'arena')
}
