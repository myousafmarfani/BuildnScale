// Historical data is available only through an explicit archive selection.
/** @param {import('./types').Snapshot[]} snapshots @param {unknown} [requestedSource] */
export function selectSnapshot(snapshots, requestedSource) {
  const source =
    requestedSource === 'evalplus' ? 'evalplus' : 'artificial-analysis'
  return snapshots.find((snapshot) => snapshot.source === source) || null
}
/** @param {import('./types').Snapshot[]} snapshots @param {string[]} [selectedIds] @param {unknown} [requestedSource] */
export function comparisonSnapshots(
  snapshots,
  selectedIds = [],
  requestedSource
) {
  if (requestedSource === 'evalplus')
    return snapshots.filter((s) => s.source === 'evalplus')
  const hasArchiveSelection = snapshots.some(
    (s) =>
      s.source === 'evalplus' &&
      s.models.some((m) => selectedIds.includes(m.id))
  )
  return hasArchiveSelection
    ? snapshots
    : snapshots.filter((s) => s.source === 'artificial-analysis')
}
