import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { normalizeArena, fetchArena } from '../lib/benchmarks/arena.mjs'
import { assertSnapshot, rankModels, arenaFreshness } from '../lib/benchmarks/core.mjs'
const row = (model_name, rank, extra = {}) => ({ model_name, organization: 'example', rating: 1200-rank, rating_lower: 1100-rank, rating_upper: 1300-rank, vote_count: 100, rank, category: 'overall', leaderboard_publish_date: '2026-10-23', ...extra })
const groups = () => ({ text: [row('A', 1), row('B', 3), row('excluded category', 1, {category:'coding'})], webdev: [row('A', 2), row('C', 1)], agent: [row('A', 1, { score: 0.2, score_ci_lower:0.1, score_ci_upper:0.3, observation_count:1000, session_count:20 }), row('B', 2, { score:-0.2, score_ci_lower:-0.3, score_ci_upper:-0.1, observation_count:500, session_count:10 })] })
const provenance = {revision:'a'.repeat(40),retrievedAt:'2026-10-27T00:00:00Z'}
const normalize = g => normalizeArena(g, provenance)
test('Arena keeps exact precision, published rank, uncertainty, counts, dates, and distinct scales', () => {
 const s=normalize(groups()), a=s.models.find(m=>m.name==='A'), b=s.models.find(m=>m.name==='B')
 assert.equal(s.models.length,3)
 assert.equal(a.scores['arena-agent'],0.2)
 assert.equal(b.scores['arena-agent'],-0.2)
 assert.deepEqual(a.evidence['arena-agent'],{rank:1,lower:0.1,upper:0.3,count:1000,sessions:20,publishedAt:'2026-10-23'})
 assert.equal(rankModels(s.models,'arena-text')[1].rank,3,'do not recompute source ranks')
 assert.equal(a.pricing,null);assert.equal(a.speed,null)
})
test('Arena keeps duplicate source labels separate and never guesses configurations', () => {
 const g=groups();g.webdev.push(row('A',5));const s=normalize(g)
 const copies=s.models.filter(m=>m.name==='A' && m.evidence['arena-webdev'])
 assert.equal(copies.length,2);assert.ok(copies.every(m=>m.identityNote));assert.notEqual(copies[0].id,copies[1].id)
})
test('Arena only selects latest overall board and tolerates genuinely missing metadata',()=>{
 const g=groups();g.text.push(row('old',1,{leaderboard_publish_date:'2026-10-01'}));g.text[0].organization='';g.text[0].vote_count=null
 const s=normalize(g);assert.ok(!s.models.some(m=>m.name==='old'));assert.equal(s.models.find(m=>m.name==='A'&&m.publisher==='Not supplied').evidence['arena-text'].count,null)
})
test('Arena rejects malformed intervals, future dates, missing boards, and indistinguishable duplicates',()=>{
 for(const mutate of [g=>g.agent[0].score_ci_lower=0.4,g=>g.text[0].leaderboard_publish_date='2099-01-01',g=>g.agent=[],g=>g.agent.forEach(row=>delete row.score),g=>g.text.forEach(row=>row.leaderboard_publish_date='2026-02-30'),g=>g.webdev.push({...g.webdev[0]})]) { const g=groups();mutate(g);assert.throws(()=>normalize(g)) }
 const s=normalize(groups());s.models[0].evidence['arena-text'].count=-1;assert.throws(()=>assertSnapshot(s))
})
test('freshness distinguishes a stale check from old published measurements',()=>{
 const s=normalize(groups());const now=Date.parse('2026-10-27T01:00:00Z')
 assert.deepEqual(arenaFreshness(s,now),{checkOverdue:false,publicationOld:false})
 assert.equal(arenaFreshness(s,now+9*3600000).checkOverdue,true)
 s.lastCheckedAt='2026-11-05T00:00:00Z';assert.deepEqual(arenaFreshness(s,Date.parse('2026-11-05T01:00:00Z')),{checkOverdue:false,publicationOld:true})
})
test('Arena fetch fails closed if source license changes',async()=>{
 await assert.rejects(fetchArena(async()=>new Response(JSON.stringify({sha:'a'.repeat(40),cardData:{license:'other'}}))),/license changed/)
})
test('bundled live-source snapshot retains exact values from all three boards',()=>{
 const s=JSON.parse(fs.readFileSync(new URL('../data/benchmarks/arena-snapshot.json',import.meta.url)))
 assertSnapshot(s)
 for(const metric of ['arena-text','arena-webdev','arena-agent']) {
  const rows=rankModels(s.models,metric);assert.ok(rows.length>10);assert.ok(rows.every(m=>m.evidence[metric].publishedAt.startsWith('2026-')))
 }
 assert.equal(s.license,'CC-BY-4.0')
})
