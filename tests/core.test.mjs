import { test } from 'node:test'
import assert from 'node:assert/strict'
import ts from 'typescript'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Load pure TypeScript helpers without introducing a second test runner.
function load(relative) {
  const filename = path.resolve(__dirname, '..', relative)
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  }).outputText
  const compiled = { exports: {} }
  new Function('require', 'module', 'exports', code)(
    require,
    compiled,
    compiled.exports
  )
  return compiled.exports
}
const { transformJSON } = load('lib/json-toolkit.ts')
const { isPublicAddress, normalizePublicURL } = load('lib/http-check.ts')
const { csvCell } = load('lib/download.ts')
const { TOOLS } = load('lib/tools-registry.ts')
test('JSON handles nested values, primitive roots, invalid syntax, and minification', () => {
  assert.equal(
    transformJSON('{"a":[1,true,null]}', 'minify').output,
    '{"a":[1,true,null]}'
  )
  assert.equal(transformJSON('null').output, 'null')
  assert.equal(transformJSON('"hello"').output, '"hello"')
  assert.equal(transformJSON('{"a":1}', 4).output, '{\n    "a": 1\n}')
  for (const value of ['', '{"a":}', '{"a":1,}', 'NaN'])
    assert.ok(transformJSON(value).error)
})
test('JSON refuses unsafe integers instead of silently rounding identifiers', () => {
  assert.ok(transformJSON('{"id":9007199254740993}').error)
  assert.ok(transformJSON('{"value":1e400}').error)
  assert.equal(
    transformJSON('{"id":"9007199254740993"}', 'minify').output,
    '{"id":"9007199254740993"}'
  )
})
test('outbound checks reject internal, mapped, and reserved addresses', () => {
  for (const ip of [
    '127.0.0.1',
    '10.1.2.3',
    '172.16.0.1',
    '192.168.1.1',
    '169.254.169.254',
    '100.64.0.1',
    '0.0.0.0',
    '224.0.0.1',
    '::1',
    '[::1]',
    '::ffff:127.0.0.1',
    'fc00::1',
    'fe80::1',
    '2001:db8::1',
    '2002:7f00:1::1',
  ])
    assert.equal(isPublicAddress(ip), false, ip)
  assert.equal(isPublicAddress('8.8.8.8'), true)
  assert.equal(isPublicAddress('2606:4700:4700::1111'), true)
})
test('website normalization rejects credentials and custom ports', () => {
  assert.equal(normalizePublicURL('example.com').href, 'https://example.com/')
  assert.equal(
    normalizePublicURL('https://example.com/path#fragment').href,
    'https://example.com/path'
  )
  for (const url of [
    'https://user:pass@example.com',
    'https://example.com:8080',
    'http://localhost',
  ])
    assert.throws(() => normalizePublicURL(url))
})
test('CSV quotes text and neutralizes spreadsheet formula injection', () => {
  assert.equal(csvCell('a,"b"'), '"a,""b"""')
  assert.equal(csvCell('=HYPERLINK("x")'), '"\'=HYPERLINK(""x"")"')
  assert.equal(csvCell('ordinary task'), '"ordinary task"')
})
test('every registered tool has a page and unique slug', () => {
  assert.equal(new Set(TOOLS.map((t) => t.slug)).size, TOOLS.length)
  for (const tool of TOOLS)
    assert.ok(
      fs.existsSync(
        path.resolve(__dirname, '../app/tools', tool.slug, 'page.tsx')
      ),
      tool.slug
    )
})
