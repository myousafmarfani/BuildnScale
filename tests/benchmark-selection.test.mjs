import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  selectSnapshot,
  comparisonSnapshots,
} from '../lib/benchmarks/selection.mjs'
const archive = { source: 'evalplus', models: [{ id: 'old-model' }] },
  current = { source: 'artificial-analysis', models: [{ id: 'current-model' }] }
test('current results are default regardless of source order', () => {
  for (const snapshots of [
    [archive, current],
    [current, archive],
  ])
    assert.equal(selectSnapshot(snapshots), current)
  assert.equal(selectSnapshot([archive, current], 'evalplus'), archive)
  assert.equal(selectSnapshot([archive, current], 'invalid-source'), current)
})
test('missing current results never silently substitute historical scores', () => {
  assert.equal(selectSnapshot([archive]), null)
  assert.equal(selectSnapshot([]), null)
  assert.equal(selectSnapshot([archive], 'evalplus'), archive)
  assert.equal(
    selectSnapshot([archive, current], ['evalplus', 'invalid']),
    current
  )
})
test('comparison picker defaults to current models; archives require explicit intent', () => {
  assert.deepEqual(comparisonSnapshots([archive, current]), [current])
  assert.deepEqual(comparisonSnapshots([archive]), [])
  assert.deepEqual(comparisonSnapshots([archive, current], [], 'evalplus'), [
    archive,
  ])
  assert.deepEqual(comparisonSnapshots([archive, current], ['old-model']), [
    archive,
    current,
  ])
})
