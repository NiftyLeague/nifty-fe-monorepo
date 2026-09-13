import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/**
 * Accessibility regression sweep (#1914) and the authenticated-surface render
 * checks (#1915).
 *
 * The dashboard routes render through the visual-audit fixture (the AuthGuard
 * skips its redirect when `VITE_AUDIT_FIXTURE` is on), so the shell, sidebar,
 * and data surfaces are exercised without a PlayFab session. Data arrives from
 * the live contract APIs; assertions target the structural shell, not row data.
 *
 * axe floor: zero serious or critical violations, with two recorded exceptions
 * (see the comments in the tests). Anything else is triaged into focused issues
 * rather than waived.
 */

const PUBLIC_ROUTES = ['/', '/games', '/degens', '/leaderboards', '/mint-o-matic']
const DASHBOARD_ROUTES = [
  '/dashboard',
  '/dashboard/overview',
  '/dashboard/degens',
  '/dashboard/items',
  '/dashboard/gamer-profile',
  '/dashboard/rentals',
]

/** Console errors that #1921 owns: the audit fixture's stub auth token reaches a
 *  vendored wallet-SDK chunk which reads a null config field. Production is
 *  clean; the fixture serves the live API today. */
const KNOWN_FIXTURE_ERROR = "reading 'substring'"

async function axeViolations(page: import('@playwright/test').Page) {
  // Recorded exceptions, each owned by a focused issue rather than waived:
  // - `iframe`: third-party embed internals (the YouTube player), not our markup.
  // - `color-contrast`: the game-nav link and sidebar description muted styles — #1922.
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
  test.skip(testInfo.project.name !== 'desktop', 'one viewport keeps the sweep cheap')
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

test('dashboard routes render the authenticated shell under the audit fixture', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'one viewport keeps the sweep cheap')

  for (const route of DASHBOARD_ROUTES) {
    await page.goto(route)
    // The AuthGuard must NOT bounce the audit fixture back to the public home.
    await expect(page).not.toHaveURL(/^http:\/\/127\.0\.0\.1:3000\/$/)
    await expect(page.locator('aside, nav, [class*="sidebar"]').first()).toBeVisible()
  }
})

test('axe: no serious or critical violations on the public routes', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'one viewport keeps the sweep cheap')

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
  test.skip(testInfo.project.name !== 'desktop', 'one viewport keeps the sweep cheap')

  for (const route of DASHBOARD_ROUTES) {
    await page.goto(route)
    const violations = await axeViolations(page)
    expect(
      violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.length })),
      `${route} axe violations`
    ).toEqual([])
  }
})
