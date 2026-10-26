import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import { chromium } from 'playwright'
const base = process.env.BNS_TEST_BASE_URL || 'http://127.0.0.1:3012'
const output = process.env.BNS_QA_DIR || '/tmp/buildnscale-benchmarks-qa'
const server = process.env.BNS_TEST_BASE_URL
  ? null
  : spawn(
      process.execPath,
      [
        'node_modules/next/dist/bin/next',
        'start',
        '--hostname',
        '127.0.0.1',
        '--port',
        '3012',
      ],
      { stdio: ['ignore', 'pipe', 'pipe'] }
    )
let browser
try {
  if (server)
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Server timeout')), 20000)
      server.once('exit', () => reject(new Error('Server exited')))
      server.stdout.on('data', (d) => {
        if (d.toString().includes('Ready')) {
          clearTimeout(timer)
          resolve()
        }
      })
    })
  await fs.mkdir(output, { recursive: true })
  browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : {}),
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  })
  await context.route('**/api/auth/session', (r) => r.fulfill({ json: {} }))
  await context.route('https://www.googletagmanager.com/**', (r) => r.abort())
  const page = await context.newPage(),
    errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(base + '/leaderboard')
  await page.getByRole('heading', { name: 'Choose with evidence.' }).waitFor()
  await page.screenshot({
    path: output + '/overview-desktop.png',
    fullPage: true,
  })
  assert.match(await page.locator('aside').innerText(), /26 Dec 2024/)
  assert.equal(await page.locator('tbody tr').count(), 25)
  const first = await page.locator('tbody tr').first().innerText()
  await page.getByRole('button', { name: 'Next →', exact: true }).click()
  await page.waitForURL(/page=2/)
  await page.waitForFunction(
    (previous) => document.querySelector('tbody tr')?.innerText !== previous,
    first
  )
  assert.notEqual(await page.locator('tbody tr').first().innerText(), first)
  await page.getByRole('button', { name: 'Reset filters' }).click()
  await page.waitForURL(base + '/leaderboard')
  const search = page.getByLabel('Search models')
  await search.fill('nonexistent-model-xyz')
  await page.getByText('No models match these filters.').first().waitFor()
  await page.getByRole('button', { name: 'Clear filters' }).click()
  await page.locator('tbody tr').first().waitFor()
  await page.getByLabel('Benchmark', { exact: true }).selectOption('mbpp+')
  await page.waitForURL(/metric=mbpp/)
  assert.match(await page.locator('thead').innerText(), /MBPP\+/)
  const picks = page.locator('tbody input[type=checkbox]')
  await picks.nth(0).check()
  await picks.nth(1).check()
  await page
    .getByRole('link', { name: 'Compare models →', exact: true })
    .click()
  await page.getByRole('heading', { name: 'Compare the evidence.' }).waitFor()
  assert.equal(await page.locator('thead th').count(), 3)
  assert.match(await page.locator('table').innerText(), /Not provided/)
  await page.getByRole('button', { name: 'Compare →', exact: true }).click()
  await page.waitForURL(/\/compare\/.+-vs-/)
  await page.getByRole('heading', { name: / vs / }).waitFor()
  const canonical = await page
    .locator('link[rel=canonical]')
    .getAttribute('href')
  await page.waitForURL((url) => url.pathname === new URL(canonical).pathname)
  assert.equal(new URL(page.url()).pathname, new URL(canonical).pathname)
  assert.match(
    await page.locator('meta[name=robots]').getAttribute('content'),
    /noindex/
  )
  await page.screenshot({
    path: output + '/comparison-desktop.png',
    fullPage: true,
  })
  await page.goto(base + '/models')
  await page.locator('tbody tr th a').first().click()
  await page.getByRole('heading', { name: 'Evaluation record' }).waitFor()
  assert.match(
    await page.locator('main').innerText(),
    /Not supplied per model in this source/
  )
  for (const path of [
    '/models/unknown-model',
    '/leaderboard/unknown-category',
    '/compare/unknown-vs-fake',
  ]) {
    const response = await page.request.get(base + path, {
      headers: { 'user-agent': 'Twitterbot/1.0' },
    })
    // App Router may stream the shell before async notFound resolves. In that
    // case the response is 200 with the not-found UI and injected noindex.
    assert.ok([200, 404].includes(response.status()), path)
    const body = await response.text()
    assert.match(body, /noindex/)
    assert.match(body, /404|not found|could not be found/i)
  }
  assert.equal(
    (await page.request.post(base + '/api/benchmarks/refresh')).status(),
    401
  )
  assert.equal(
    (await page.request.get(base + '/api/benchmarks/refresh')).status(),
    405
  )
  assert.match(
    (await page.request.get(base + '/leaderboard/share-image')).headers()[
      'content-type'
    ],
    /image\/png/
  )
  const sitemap = await (await page.request.get(base + '/sitemap.xml')).text()
  assert.match(sitemap, /\/leaderboard\/coding/)
  assert.match(sitemap, /\/models\//)
  assert.doesNotMatch(sitemap, /\/compare\//)
  await page.goto(base + '/leaderboard/value')
  await page
    .getByRole('heading', { name: 'No verified price feed published yet.' })
    .waitFor()
  await page.getByLabel('Requests / month').fill('5000')
  await page.goto(base + '/leaderboard/coding?q=deepseek&metric=humaneval%2B')
  assert.ok((await page.locator('tbody tr').count()) > 0)
  assert.match(await page.locator('tbody').innerText(), /deepseek/i)
  for (const theme of ['dark', 'light']) {
    await page.evaluate(
      (t) => document.documentElement.setAttribute('data-theme', t),
      theme
    )
    await page.screenshot({
      path: `${output}/coding-desktop-${theme}.png`,
      fullPage: true,
    })
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(base + '/leaderboard/coding')
  const mobileCards = page
    .getByLabel('Mobile benchmark results')
    .locator('article')
  assert.equal(await mobileCards.count(), 25)
  const scoreBox = await mobileCards.first().locator('strong').boundingBox()
  assert.ok(scoreBox && scoreBox.x >= 0 && scoreBox.x + scoreBox.width <= 390)
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  )
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page
    .getByRole('navigation', { name: 'Mobile navigation', exact: true })
    .getByRole('link', { name: 'AI benchmarks' })
    .click()
  await page.getByRole('heading', { name: 'Choose with evidence.' }).waitFor()
  await page.screenshot({
    path: output + '/leaderboard-mobile.png',
    fullPage: true,
  })
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    )
  )
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      ),
      `Viewport overflow at ${width}px`
    )
  }
  assert.deepEqual(errors, [])
  console.log(
    'Benchmark browser checks passed: filters, pagination, comparison, canonicalization, evidence, 404s, API protection, metadata, mobile, themes.'
  )
} finally {
  await browser?.close()
  server?.kill('SIGTERM')
}
