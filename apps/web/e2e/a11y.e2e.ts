import { expect, test } from '@playwright/test'

const ROUTES = [
  '/',
  '/careers',
  '/community',
  '/compete-and-earn',
  '/degens',
  '/disclaimer',
  '/games',
  '/lore',
  '/niftyworld',
  '/overview',
  '/privacy-policy',
  '/roadmap',
  '/team',
  '/terms-of-service',
]

test.setTimeout(180_000)

test('axe: no serious or critical violations on the marketing routes', async ({ page }) => {
  for (const route of ROUTES) {
    await page.goto(route)
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight))
    await page.waitForTimeout(500)

    const { AxeBuilder } = await import('@axe-core/playwright')
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
