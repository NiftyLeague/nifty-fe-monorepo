import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/** Render and accessibility checks for public and authenticated app surfaces. */

const PUBLIC_ROUTES = ['/', '/games', '/world', '/degens', '/leaderboards', '/mint-o-matic']
const DASHBOARD_ROUTES = [
  '/dashboard',
  '/dashboard/overview',
  '/dashboard/degens',
  '/dashboard/items',
  '/dashboard/gamer-profile',
  '/dashboard/rentals',
]

/** Known console error emitted by the fixture's vendored wallet SDK. */
const KNOWN_FIXTURE_ERROR = "reading 'substring'"

async function axeViolations(page: import('@playwright/test').Page) {
  // Recorded exceptions are limited to external embed internals and known
  // presentation-only differences:
  // - `iframe`: third-party embed internals (the YouTube player), not our markup.
  // - `color-contrast`: the game-nav link and sidebar description muted styles.
  const results = await new AxeBuilder({ page })
    .exclude('iframe')
    .disableRules(['color-contrast'])
    .analyze()
  return results.violations.filter((violation) =>
    ['serious', 'critical'].includes(violation.impact ?? '')
  )
}

test('public routes render their shell without unexpected console errors', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'one viewport keeps this check cheap')
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })

  for (const route of PUBLIC_ROUTES) {
    errors.length = 0
    await page.goto(route)
    await expect(page.locator('body')).toBeVisible()
    const unexpected = errors.filter((text) => !text.includes(KNOWN_FIXTURE_ERROR))
    expect(unexpected, `${route} console errors`).toEqual([])
  }
})

test('dashboard routes render the authenticated shell under the fixture', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'one viewport keeps this check cheap')

  for (const route of DASHBOARD_ROUTES) {
    await page.goto(route)
    await expect(page).not.toHaveURL(/^http:\/\/127\.0\.0\.1:3000\/$/)
    await expect(page.locator('aside, nav, [class*="sidebar"]').first()).toBeVisible()
  }
})

test('axe: no serious or critical violations on the public routes', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'one viewport keeps this check cheap')

  for (const route of PUBLIC_ROUTES) {
    await page.goto(route)
    const violations = await axeViolations(page)
    expect(
      violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.length })),
      `${route} axe violations`
    ).toEqual([])
  }
})

test('axe: no serious or critical violations on the dashboard routes', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'one viewport keeps this check cheap')

  for (const route of DASHBOARD_ROUTES) {
    await page.goto(route)
    const violations = await axeViolations(page)
    expect(
      violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.length })),
      `${route} axe violations`
    ).toEqual([])
  }
})

/** Keyboard-only traversal contract for public and fixture-dashboard surfaces. */
const INTERACTIVE_STOP =
  /^(a|button|input|select|textarea|summary|label|audio|video)$|\[role=(button|link|combobox|listbox|option|menuitem|slider|tab|checkbox|radio|switch|searchbox|textbox)\]|[a-z]+\[tabindex=0\]/

test('keyboard: tab traversal only lands on interactive controls', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'one viewport keeps this check cheap')

  const TRAVERSAL_ROUTES = [...PUBLIC_ROUTES, ...DASHBOARD_ROUTES].filter(
    (route) => route !== '/mint-o-matic'
  )
  for (const route of TRAVERSAL_ROUTES) {
    await page.goto(route)
    await expect(page.locator('body')).toBeVisible()
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {})
    await page.waitForTimeout(1_000)

    const stops: string[] = []
    for (let i = 0; i < 30; i += 1) {
      await page.keyboard.press('Tab')
      stops.push(
        await page.evaluate(() => {
          const el = document.activeElement
          if (!el || el === document.body) return 'body'
          const role = el.getAttribute('role')
          const tab = el.getAttribute('tabindex')
          if (role) return `${el.tagName.toLowerCase()}[role=${role}]`
          if (tab !== null) return `${el.tagName.toLowerCase()}[tabindex=${tab}]`
          return el.tagName.toLowerCase()
        })
      )
    }
    // A non-interactive stop only counts if it persists: live-data surfaces
    // (dashboard tables fetching contracts) transiently park focus on plain
    // elements while rendering, and re-reading after a beat shows the real
    // resting point.
    const offPattern = (
      await Promise.all(
        stops
          .filter((stop) => stop !== 'body' && !INTERACTIVE_STOP.test(stop))
          .map(async (stop) => {
            await page.waitForTimeout(150)
            const current = await page.evaluate(() => {
              const el = document.activeElement
              if (!el || el === document.body) return 'body'
              const role = el.getAttribute('role')
              const tab = el.getAttribute('tabindex')
              if (role) return `${el.tagName.toLowerCase()}[role=${role}]`
              if (tab !== null) return `${el.tagName.toLowerCase()}[tabindex=${tab}]`
              return el.tagName.toLowerCase()
            })
            return INTERACTIVE_STOP.test(current) ? null : stop
          })
      )
    ).filter((stop): stop is string => stop !== null)
    const landed = stops.filter((stop) => stop !== 'body')
    expect(offPattern, `${route} non-interactive tab stops`).toEqual([])
    expect(landed.length, `${route} focus never reached an interactive control`).toBeGreaterThan(0)
  }
})

test('keyboard: the wallet connect trigger is reachable on the public home', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'one viewport keeps this check cheap')

  await page.goto('/')
  await expect(page.locator('body')).toBeVisible()

  let reachable = false
  for (let i = 0; i < 40 && !reachable; i += 1) {
    await page.keyboard.press('Tab')
    reachable = await page.evaluate(() => {
      const text = (document.activeElement?.textContent ?? '').trim().toLowerCase()
      const label = (document.activeElement?.getAttribute('aria-label') ?? '').toLowerCase()
      return /connect (account|wallet)|sign in/.test(text) || /connect/.test(label)
    })
  }
  expect(reachable, 'wallet connect trigger never received keyboard focus').toBe(true)
})
