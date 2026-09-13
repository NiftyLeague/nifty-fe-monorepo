import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/**
 * Accessibility sweep for the marketing surface (#1914). Keyboard, focus, and
 * reduced-motion interaction checks live in `regression.e2e.ts`; this file owns
 * the page-level axe pass: labels, contrast, ARIA, landmark structure.
 *
 * Floor: zero serious or critical violations per route. Lower-impact findings
 * get triaged into focused issues rather than waived.
 */

const ROUTES = ['/', '/games', '/degens', '/roadmap', '/overview', '/community']

test('axe: no serious or critical violations on the marketing routes', async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route)
    // The deferred islands hydrate on viewport approach; scroll the page so
    // every island is mounted before the sweep.
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight))
    await page.waitForTimeout(500)

    const { AxeBuilder } = await import('@axe-core/playwright')
    // Third-party embeds (the YouTube player's own iframe internals) are excluded:
  // they are not our markup and not fixable in this repository.
  const results = await new AxeBuilder({ page }).exclude('iframe').analyze()
    const violations = results.violations.filter((violation) =>
      ['serious', 'critical'].includes(violation.impact ?? '')
    )
    expect(
      violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.length })),
      `${route} axe violations`
    ).toEqual([])
  }
})
