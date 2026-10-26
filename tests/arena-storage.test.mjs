import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import ts from 'typescript'
import { assertSnapshot } from '../lib/benchmarks/core.mjs'
const require = createRequire(import.meta.url)
const seed = JSON.parse(fs.readFileSync(new URL('../data/benchmarks/arena-snapshot.json',import.meta.url)))
function harness(previous, next = structuredClone(seed), failure) {
  const writes=[]
  const prisma={benchmarkSnapshot:{findFirst:async()=>previous ? {payload:previous} : null,upsert:async args=>{writes.push(args)}}}
  const mocks={ '@/lib/prisma':{prisma}, './core.mjs':{assertSnapshot}, './arena.mjs':{fetchArena:async()=>{if(failure)throw failure;return next}}, './artificial-analysis.mjs':{} }
  const compiled={exports:{}}
  const code=ts.transpileModule(fs.readFileSync(new URL('../lib/benchmarks/import.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText
  new Function('require','module','exports',code)(id=>mocks[id] || require(id),compiled,compiled.exports)
  return {importer:()=>compiled.exports.importBenchmarks('arena'),writes}
}
test('a validated Arena revision is published in one write; unchanged checks retain immutable payload',async()=>{
 const h=harness(seed);await h.importer();assert.equal(h.writes.length,1)
 const write=h.writes[0]
 assert.equal(write.create.source,'arena');assert.equal(write.create.payload.sourceRevision,seed.sourceRevision)
 assert.deepEqual(Object.keys(write.update),['retrievedAt']);assert.ok(write.update.retrievedAt instanceof Date)
})
test('source outages and per-board coverage drops preserve published snapshot without any write',async()=>{
 const failed=harness(seed,seed,new Error('source outage'));await assert.rejects(failed.importer(),/source outage/);assert.equal(failed.writes.length,0)
 const next=structuredClone(seed);next.sourceRevision='b'.repeat(40)
 for(const m of next.models.slice(30)){delete m.scores['arena-webdev'];delete m.evidence['arena-webdev']}
 const reduced=harness(seed,next);await assert.rejects(reduced.importer(),/coverage dropped/i);assert.equal(reduced.writes.length,0)
})
test('regressed board dates cannot replace newer results even when model labels change',async()=>{
 const next=structuredClone(seed);next.sourceRevision='c'.repeat(40)
 for(const m of next.models){m.id+='-new';for(const ev of Object.values(m.evidence))ev.publishedAt='2026-01-01'}
 const h=harness(seed,next);await assert.rejects(h.importer(),/date regressed/);assert.equal(h.writes.length,0)
})
