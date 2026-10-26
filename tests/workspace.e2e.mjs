import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import { chromium } from 'playwright'

const base = process.env.BNS_TEST_BASE_URL || 'http://127.0.0.1:3011'
const output = process.env.BNS_QA_DIR || '/tmp/buildnscale-workspace-qa'
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
        '3011',
      ],
      { stdio: ['ignore', 'pipe', 'pipe'] }
    )
let browser
try {
  if (server)
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error('Preview server did not start')),
        20000
      )
      server.once('exit', (code) => reject(new Error(`Server exited: ${code}`)))
      server.stdout.on('data', (data) => {
        if (data.toString().includes('Ready')) {
          clearTimeout(timeout)
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
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
  })
  const context = await browser.newContext()
  await context.route('**/api/auth/session', (route) =>
    route.fulfill({ json: {} })
  )
  await context.route('https://www.googletagmanager.com/**', (route) =>
    route.abort()
  )
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  const tools = [
    'daily-planner',
    'pomodoro',
    'markdown-notes',
    'habit-tracker',
    'rate-calculator',
    'weekly-review',
    'downtime-detector',
    'json-toolkit',
  ]
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const tool of tools) {
      await page.goto(`${base}/tools/${tool}`)
      await page.locator('.tool-page-title').waitFor()
      assert.equal(
        await page.getByRole('heading', { level: 1 }).count(),
        1,
        `${tool}: one page title`
      )
      const overflow = await page.evaluate(() => ({
        page: document.documentElement.scrollWidth > innerWidth + 1,
        workspace:
          document.querySelector('.workspace-content').scrollWidth >
          document.querySelector('.workspace-content').clientWidth + 1,
      }))
      assert.equal(
        overflow.page,
        false,
        `${tool} at ${width}: viewport overflow`
      )
      assert.equal(
        overflow.workspace,
        false,
        `${tool} at ${width}: workspace overflow`
      )
      if (width === 390 || width === 1440)
        await page.screenshot({ path: `${output}/${tool}-${width}.png` })
    }
  }
  console.log(
    'PASS: all eight tools at 320, 390, 768, and 1440px; no horizontal viewport overflow'
  )
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(`${base}/tools/daily-planner`)
  const widthBefore = await page
    .locator('.workspace-content')
    .evaluate((element) => element.clientWidth)
  await page
    .getByRole('button', { name: 'Collapse tool sidebar', exact: true })
    .click()
  assert.equal(
    await page
      .getByRole('complementary', { name: 'Tool sidebar', exact: true })
      .isVisible(),
    false
  )
  assert.ok(
    (await page
      .locator('.workspace-content')
      .evaluate((element) => element.clientWidth)) >
      widthBefore + 200
  )
  await page.reload()
  await page
    .getByRole('button', { name: 'Expand tool sidebar', exact: true })
    .waitFor()
  await page.goto(`${base}/tools/json-toolkit`)
  await page
    .getByRole('button', { name: 'Expand tool sidebar', exact: true })
    .click()
  await page
    .getByRole('complementary', { name: 'Tool sidebar', exact: true })
    .waitFor()
  console.log(
    'PASS: desktop sidebar collapse, reclaimed space, reload persistence, and reopening on another tool'
  )

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(`${base}/tools/daily-planner`)
  await page
    .getByLabel('What would you like to get done?')
    .fill('Ship checkout fix')
  await page.getByLabel('New task start time').selectOption('18')
  await page.getByRole('button', { name: 'Add task', exact: true }).click()
  await page
    .getByLabel('Task title: Ship checkout fix', { exact: true })
    .waitFor()
  await page
    .getByRole('button', {
      name: 'Mark Ship checkout fix complete',
      exact: true,
    })
    .click()
  await page.reload()
  await page
    .getByRole('button', {
      name: 'Mark Ship checkout fix incomplete',
      exact: true,
    })
    .waitFor()
  await page
    .getByLabel('What would you like to get done?')
    .fill('Overlapping task')
  await page.getByLabel('New task start time').selectOption('18')
  await page.getByRole('button', { name: 'Add task', exact: true }).click()
  await page
    .getByText('That time overlaps another task.', { exact: false })
    .waitFor()
  assert.equal(
    await page
      .getByLabel('Task title: Overlapping task', { exact: true })
      .count(),
    0
  )
  console.log(
    'PASS: planner add, schedule, complete, reload persistence, and overlap protection'
  )
  await page.getByRole('button', { name: 'Tool settings', exact: true }).click()
  const preferences = page.getByRole('dialog', {
    name: 'Planner preferences',
    exact: true,
  })
  await preferences.getByLabel('Time format').selectOption('12h')
  for (let step = 0; step < 10; step++) await page.keyboard.press('Tab')
  assert.equal(
    await page.evaluate(() => !!document.activeElement?.closest('dialog')),
    true
  )
  await page.keyboard.press('Escape')
  assert.equal(await preferences.isVisible(), false)
  console.log(
    'PASS: native settings dialog traps keyboard focus and closes with Escape'
  )
  await page.getByRole('button', { name: 'Open workspace navigation' }).click()
  const menu = page.getByRole('dialog', {
    name: 'Workspace navigation',
    exact: true,
  })
  await menu.getByRole('link', { name: 'Home', exact: true }).waitFor()
  await menu.getByRole('link', { name: 'Build log', exact: true }).waitFor()
  await menu.getByRole('link', { name: 'Roadmap', exact: true }).waitFor()
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Find a tool or page' }).click()
  await page
    .getByRole('textbox', { name: 'Search tools and pages' })
    .fill('notes')
  await page
    .getByRole('dialog', { name: 'Find a tool or page', exact: true })
    .getByRole('link', { name: 'Markdown Notes', exact: true })
    .click()
  await page
    .getByRole('heading', { name: 'A little space for your thoughts.' })
    .waitFor()
  console.log('PASS: mobile navigation and searchable tool switching')
  await page.getByRole('button', { name: 'New note', exact: true }).click()
  await page
    .getByRole('textbox', { name: 'Note title', exact: true })
    .fill('Build notes')
  await page
    .getByRole('textbox', { name: 'Markdown content', exact: true })
    .fill(
      '# Shipped\n\nA useful update.\n\n<img src=x onerror=alert(1)>\n<script>alert(1)</script>'
    )
  await page.getByRole('button', { name: 'Preview', exact: true }).click()
  await page
    .locator('.note-preview-pane')
    .getByRole('heading', { name: 'Shipped' })
    .waitFor()
  assert.equal(
    await page
      .locator('.note-preview-pane script, .note-preview-pane img')
      .count(),
    0
  )
  await page.reload()
  await page.getByRole('textbox', { name: 'Note title', exact: true }).waitFor()
  assert.equal(
    await page
      .getByRole('textbox', { name: 'Note title', exact: true })
      .inputValue(),
    'Build notes'
  )
  console.log('PASS: notes creation, preview sanitization, and persistence')
  await page.goto(`${base}/tools/habit-tracker`)
  await page
    .getByRole('textbox', { name: 'New habit', exact: true })
    .fill('Read 20 minutes')
  await page.getByRole('button', { name: 'Add habit', exact: true }).click()
  await page
    .getByRole('button', { name: 'Check in Read 20 minutes', exact: true })
    .click()
  await page.reload()
  await page
    .getByRole('button', { name: 'Check in Read 20 minutes', exact: true })
    .waitFor()
  assert.equal(
    await page
      .getByRole('button', { name: 'Check in Read 20 minutes', exact: true })
      .getAttribute('aria-pressed'),
    'true'
  )
  console.log('PASS: habit creation, check-in, and persistence')
  await page.goto(`${base}/tools/pomodoro`)
  await page
    .getByRole('textbox', { name: 'New focus task', exact: true })
    .fill('Test focus flow')
  await page
    .getByRole('button', { name: 'Add focus task', exact: true })
    .click()
  await page.getByRole('button', { name: 'Start focus', exact: true }).click()
  await page.getByRole('button', { name: 'Pause', exact: true }).waitFor()
  await page.reload()
  await page.getByRole('button', { name: 'Pause', exact: true }).waitFor()
  await page.getByRole('button', { name: 'Pause', exact: true }).click()
  await page
    .getByRole('button', { name: /Resume|Start focus/, exact: true })
    .waitFor()
  console.log(
    'PASS: timer queue, start/pause, and active timer restoration after reload'
  )
  await page.goto(`${base}/tools/weekly-review`)
  await page
    .getByRole('textbox', { name: /What went well/ })
    .fill('Shipped a useful fix.')
  await page.reload()
  assert.equal(
    await page.getByRole('textbox', { name: /What went well/ }).inputValue(),
    'Shipped a useful fix.'
  )
  console.log('PASS: weekly reflection saves the latest input')
  await page.goto(`${base}/tools/rate-calculator`)
  await page
    .getByRole('spinbutton', { name: 'Take-home income goal', exact: true })
    .fill('5000')
  await page
    .getByRole('spinbutton', { name: 'Monthly business expenses', exact: true })
    .fill('1000')
  await page
    .getByRole('spinbutton', { name: 'Billable hours each week', exact: true })
    .fill('30')
  await page
    .getByRole('spinbutton', { name: 'Working weeks each year', exact: true })
    .fill('48')
  await page
    .locator('.rate-number')
    .getByText('$50', { exact: false })
    .waitFor()
  assert.equal(
    await page
      .getByRole('button', {
        name: 'Print / save invoice as PDF',
        exact: false,
      })
      .isEnabled(),
    false
  )
  console.log(
    'PASS: rate calculation updates and invoice requires client details'
  )
  await page.goto(`${base}/tools/json-toolkit`)
  await page
    .getByRole('textbox', { name: 'JSON INPUT', exact: true })
    .fill('{"ready":true}')
  assert.ok(
    (
      await page
        .getByRole('textbox', { name: 'OUTPUT', exact: true })
        .inputValue()
    ).includes('"ready": true')
  )
  await page
    .getByRole('textbox', { name: 'JSON INPUT', exact: true })
    .fill('{"ready":}')
  await page.getByText('Invalid JSON:', { exact: false }).waitFor()
  assert.equal(
    await page
      .getByRole('button', { name: 'Download', exact: true })
      .isEnabled(),
    false
  )
  console.log('PASS: JSON validation and invalid-output download guard')
  await page.route('**/api/downtime/check', (route) =>
    route.fulfill({
      json: {
        url: 'https://example.com',
        is_up: true,
        status_code: 200,
        response_ms: 123,
        region: 'test-region',
        checked_at: new Date().toISOString(),
      },
    })
  )
  await page.route('**/api/downtime/history?*', (route) =>
    route.fulfill({ json: { days: [], uptimePercent: null } })
  )
  await page.goto(`${base}/tools/downtime-detector`)
  await page
    .getByRole('textbox', { name: 'Website address', exact: true })
    .fill('example.com')
  await page
    .getByRole('button', { name: 'Check website', exact: false })
    .click()
  await page.getByText('Responding successfully', { exact: true }).waitFor()
  console.log('PASS: guest website check success state (mocked HTTP API)')
  await page.getByRole('button', { name: 'Toggle theme', exact: true }).click()
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light')
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    for (const tool of [
      'daily-planner',
      'pomodoro',
      'markdown-notes',
      'habit-tracker',
      'rate-calculator',
      'weekly-review',
    ]) {
      await page.goto(`${base}/tools/${tool}`)
      await page.locator('.tool-page-title').waitFor()
      if (tool === 'markdown-notes')
        await page.waitForFunction(() =>
          [...document.querySelectorAll('button')].some(
            (button) =>
              button.textContent.includes('New note') && !button.disabled
          )
        )
      const innerOverflow = await page.evaluate(() => {
        const panel =
          document.querySelector('.tool-page-scroll') ||
          document.querySelector('.notes-work-area')
        return panel.scrollWidth > panel.clientWidth + 1
      })
      assert.equal(
        innerOverflow,
        false,
        `${tool} at ${width}: populated work area is clipped`
      )
      await page.screenshot({
        path: `${output}/${tool}-${width}-light-populated.png`,
      })
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1
        ),
        false
      )
    }
  }
  console.log(
    'PASS: light theme and populated workspaces at mobile and desktop widths'
  )
  await page.setViewportSize({ width: 390, height: 500 })
  await page.goto(`${base}/tools/markdown-notes`)
  await page
    .getByRole('textbox', { name: 'Markdown content', exact: true })
    .focus()
  const editorBox = await page
    .getByRole('textbox', { name: 'Markdown content', exact: true })
    .boundingBox()
  assert.ok(
    editorBox.height > 80,
    'Short mobile viewport retains usable writing space'
  )
  console.log('PASS: compact mobile writing area at 390 × 500px')
  const authenticated = await browser.newContext({
    viewport: { width: 390, height: 844 },
  })
  await authenticated.route('**/api/auth/session', (route) =>
    route.fulfill({
      json: {
        user: { id: 'qa-user', name: 'QA User', email: 'qa@example.test' },
        expires: '2099-01-01T00:00:00.000Z',
      },
    })
  )
  let monitors = []
  await authenticated.route('**/api/downtime/sites**', async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    if (url.pathname.endsWith('/checks')) {
      const site = monitors[0]
      await route.fulfill({
        json: {
          ...site,
          siteId: site.id,
          range: Number(url.searchParams.get('range') || 30),
          upChecks: 1,
          downChecks: 0,
          days: [],
          incidents: [],
        },
      })
      return
    }
    if (url.pathname.endsWith('/check')) {
      monitors = monitors.map((site) => ({
        ...site,
        lastCheck: {
          isUp: true,
          checkedAt: new Date().toISOString(),
          responseMs: 120,
          statusCode: 200,
        },
        uptimePercent: 100,
        totalChecks: 1,
      }))
      await route.fulfill({ json: { isUp: true } })
      return
    }
    if (request.method() === 'POST') {
      const body = request.postDataJSON()
      const site = {
        id: 'qa-monitor',
        url: body.url,
        displayName: body.display_name,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastCheck: null,
        uptimePercent: null,
        totalChecks: 0,
      }
      monitors.push(site)
      await route.fulfill({ json: site })
      return
    }
    if (request.method() === 'PATCH') {
      monitors = monitors.map((site) => ({
        ...site,
        displayName: request.postDataJSON().display_name,
      }))
      await route.fulfill({ json: monitors[0] })
      return
    }
    if (request.method() === 'DELETE') {
      monitors = []
      await route.fulfill({ json: { ok: true } })
      return
    }
    await route.fulfill({ json: monitors })
  })
  const accountPage = await authenticated.newPage()
  accountPage.on('pageerror', (error) => errors.push(error.message))
  await accountPage.goto(`${base}/tools/downtime-detector`)
  await accountPage
    .getByRole('button', { name: 'Add a monitor', exact: true })
    .click()
  await accountPage
    .getByRole('textbox', { name: 'Website address', exact: true })
    .last()
    .fill('https://example.com')
  await accountPage
    .getByRole('textbox', { name: 'Display name', exact: false })
    .fill('QA website')
  await accountPage
    .getByRole('button', { name: 'Add & check website', exact: true })
    .click()
  await accountPage
    .getByRole('link', { name: 'QA website', exact: true })
    .waitFor()
  await accountPage.getByRole('button', { name: 'Rename', exact: true }).click()
  await accountPage
    .getByRole('textbox', { name: 'Monitor display name', exact: true })
    .fill('Renamed website')
  await accountPage.getByRole('button', { name: 'Save', exact: true }).click()
  await accountPage
    .getByRole('link', { name: 'Renamed website', exact: true })
    .waitFor()
  await accountPage.getByRole('link', { name: 'History', exact: false }).click()
  await accountPage
    .getByRole('heading', { name: 'Renamed website', exact: true })
    .waitFor()
  await accountPage.screenshot({ path: `${output}/monitor-detail-390.png` })
  await accountPage
    .locator('.workspace-content')
    .getByRole('link', { name: 'Downtime Detector', exact: true })
    .click()
  await accountPage
    .getByRole('button', {
      name: 'Remove monitor Renamed website',
      exact: true,
    })
    .waitFor()
  accountPage.once('dialog', (dialog) => dialog.accept())
  await accountPage
    .getByRole('button', {
      name: 'Remove monitor Renamed website',
      exact: true,
    })
    .click()
  await accountPage
    .getByRole('heading', { name: 'Your watchlist is ready.', exact: true })
    .waitFor()
  await authenticated.close()
  console.log(
    'PASS: signed-in monitor create, rename, history navigation, and removal (mocked account/API)'
  )

  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(`${base}/blog`)
    await page
      .getByRole('navigation', { name: 'Blog categories', exact: true })
      .waitFor()
    await page.evaluate(() => window.scrollTo(0, 700))
    await page.waitForFunction(() => {
      const header = document.querySelector('.site-nav').getBoundingClientRect()
      const filter = document
        .querySelector('[aria-label="Blog categories"]')
        .getBoundingClientRect()
      return Math.abs(filter.top - header.bottom) < 1
    })
    await page.screenshot({ path: `${output}/blog-filters-${width}.png` })
    await page.goto(`${base}/blog/why-time-blocking`)
    const tocToggle = page.getByRole('button', {
      name: 'On this page',
      exact: true,
    })
    await tocToggle.waitFor()
    // The preference is shared across responsive views and articles.
    if ((await tocToggle.getAttribute('aria-expanded')) === 'false')
      await tocToggle.click()
    await tocToggle.click()
    assert.equal(await tocToggle.getAttribute('aria-expanded'), 'false')
    assert.equal(
      await page
        .getByRole('navigation', { name: 'On this page', exact: true })
        .count(),
      0
    )
    await page.reload()
    await page
      .getByRole('button', { name: 'On this page', exact: true })
      .waitFor()
    await page.waitForFunction(() =>
      [...document.querySelectorAll('button')].some(
        (button) =>
          button.textContent.includes('On this page') &&
          button.getClientRects().length &&
          button.getAttribute('aria-expanded') === 'false'
      )
    )
    await page
      .getByRole('button', { name: 'On this page', exact: true })
      .click()
    const toc = page.getByRole('navigation', {
      name: 'On this page',
      exact: true,
    })
    const headingId = await page
      .locator('.blog-article-body h2')
      .first()
      .getAttribute('id')
    await toc.getByRole('button').first().click()
    await page.waitForFunction((id) => {
      const heading = document.getElementById(id)
      const bar = document
        .querySelector('[aria-label="Article navigation"]')
        .getBoundingClientRect()
      return (
        Math.abs(heading.getBoundingClientRect().top - 144) < 4 &&
        heading.getBoundingClientRect().top > bar.bottom
      )
    }, headingId)
    await page.screenshot({ path: `${output}/blog-article-${width}.png` })
  }
  console.log(
    'PASS: blog sticky filters, collapsible TOC persistence, and unobscured heading navigation at mobile/desktop widths'
  )
  assert.deepEqual(errors, [], `Browser runtime errors: ${errors.join('\n')}`)
  console.log(`PASS: no browser runtime errors; screenshots in ${output}`)
} finally {
  await browser?.close()
  server?.kill()
}
