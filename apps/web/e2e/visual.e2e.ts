import { expect, test } from '@playwright/test'

test.use({ colorScheme: 'dark' })

test('home matches the committed baseline', async ({ page }, testInfo) => {
  test.skip(!process.env.VISUAL_BASELINES, 'baselines run in the dedicated CI job')
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1000)

  await expect(page).toHaveScreenshot(`${testInfo.project.name}-home.png`, {
    fullPage: true,
    animations: 'disabled',
    maxDiffPixelRatio: 0.02,
  })
})
