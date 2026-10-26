import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'

test('AA display gate removes stored data from warm reads, profiles, and history', async () => {
  const seed = {source:'evalplus',retrievedAt:'2026-10-26',models:[{id:'eval-model'}]}
  const aa = {source:'artificial-analysis',retrievedAt:'2026-10-26',models:[{id:'aa-model'}]}
  const rows = [seed,aa].map(payload=>({source:payload.source,payload}))
  let reads=0
  const prisma={benchmarkSnapshot:{
    findFirst:async({where})=>{reads++;return rows.find(row=>row.source===where.source)},
    findMany:async({where})=>rows.filter(row=>where.source.in.includes(row.source)),
  }}
  const mocks={
    '@/data/benchmarks/evalplus-snapshot.json':seed,
    '@/lib/prisma':{prisma},
    './core.mjs':{assertSnapshot:snapshot=>snapshot},
    'next/cache':{unstable_cache:fn=>{let cached;return ()=>cached??=fn()}},
  }
  const compiled={exports:{}}
  const code=ts.transpileModule(fs.readFileSync(new URL('../lib/benchmarks/data.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText
  new Function('require','module','exports',code)(id=>mocks[id],compiled,compiled.exports)
  const {getSnapshots,getModel,getHistory}=compiled.exports
  const original=Object.fromEntries(['DATABASE_URL','AA_PUBLIC_DISPLAY_ENABLED','AA_PERMISSION_REFERENCE'].map(key=>[key,process.env[key]]))
  try {
    process.env.DATABASE_URL='test-only'
    process.env.AA_PUBLIC_DISPLAY_ENABLED='true'
    process.env.AA_PERMISSION_REFERENCE='test-agreement'
    assert.equal((await getSnapshots()).length,2)
    assert.ok(await getModel('aa-model'))
    assert.ok((await getHistory()).some(s=>s.source==='artificial-analysis'))
    process.env.AA_PUBLIC_DISPLAY_ENABLED='false'
    assert.deepEqual((await getSnapshots()).map(s=>s.source),['evalplus'])
    assert.equal(await getModel('aa-model'),null)
    assert.ok((await getHistory()).every(s=>s.source==='evalplus'))
    assert.equal(reads,2,'stored snapshot cache should remain warm throughout')
    process.env.AA_PUBLIC_DISPLAY_ENABLED='true'
    process.env.AA_PERMISSION_REFERENCE=''
    assert.ok((await getSnapshots()).every(s=>s.source==='evalplus'))
  } finally {
    for(const [key,value] of Object.entries(original)){
      if(value===undefined)delete process.env[key];else process.env[key]=value
    }
  }
})
