import { expect, test } from '@playwright/test'

/**
 * Regression matrix for the marketing surface's interaction states — the checks
 * that cannot run in happy-dom: real keyboard traversal, real viewport media, and
 * CSS animations under emulated `prefers-reduced-motion`. Route-level contracts
 * live in `test/contract/`, and the full route × state matrix is documented in
 * `docs/architecture/m5-regression-matrix.md`.
 */
const DESKTOP_NAV = 'nav[class*="md:block"]'
// The labeled nav wraps both menus (desktop menu + mobile panel), so the desktop
// menu is scoped by the visibility class its responsive styling carries.
const DESKTOP_MENU = `${DESKTOP_NAV} > ul`
const MOBILE_NAV = '#nifty-mobile-navigation'
const MOBILE_TOGGLE = 'summary[aria-controls="nifty-mobile-navigation"]'

test('the cold-load tab order traverses logo, nav, and page without a trap', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'the desktop menu is hidden below md')
  await page.goto('/')
  const nav = page.locator(DESKTOP_MENU)
  await expect(nav).toBeVisible()

  // Walk the real tab order from a cold load. The navbar hydrates client:load, so
  // early tabs may land on the shell before the links exist.
  const focused: string[] = []
  for (let tab = 0; tab < 60; tab += 1) {
    await page.keyboard.press('Tab')
    focused.push(
      await page.evaluate(
        () =>
          (document.activeElement as HTMLAnchorElement | null)?.getAttribute('href') ??
          document.activeElement?.tagName.toLowerCase() ??
          ''
      )
    )
    if (focused.includes('/tally')) break
  }

  // The walk must start at the logo, then reach the three group disclosures and
  // the action button in DOM order — the whole header is keyboard-operable.
  expect(focused.slice(0, 5)).toEqual(['/', 'summary', 'summary', 'summary', '/app'])

  // No keyboard trap: focus keeps moving into the page and through the footer,
  // where routes without a header entry (roadmap, lore) are reachable.
  for (const href of ['/roadmap', '/lore']) {
    expect(focused, `${href} is reachable by keyboard alone`).toContain(href)
  }
})

test('group disclosures expose their pages to the keyboard', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'the desktop menu is hidden below md')
  await page.goto('/')
  const gamesGroup = page.locator(`${DESKTOP_MENU} details summary`).first()
  await gamesGroup.focus()
  await page.keyboard.press('Enter')

  const gamesLink = page.locator(`${DESKTOP_MENU} details a[href="/games"]`)
  await expect(gamesLink).toBeVisible()

  // Focus stays on the summary after opening; walk into the revealed panel.
  for (let tab = 0; tab < 5; tab += 1) {
    await page.keyboard.press('Tab')
    if ((await page.evaluate(() => document.activeElement?.getAttribute('href'))) === '/games')
      break
  }
  await expect(gamesLink).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/games$/)
})

test('the mobile disclosure opens, navigates, and closes', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'the disclosure is the compact-viewport nav')
  await page.goto('/')

  const toggle = page.locator(MOBILE_TOGGLE)
  await toggle.click()
  const panelLink = page.locator(`${MOBILE_NAV} a[href="/roadmap"]`).first()
  await expect(panelLink).toBeVisible()
  await panelLink.click()
  await expect(page).toHaveURL(/\/roadmap$/)

  await page.goBack()
  // The panel is a native <details>: the open state must not persist across documents.
  await expect(page.locator(`${MOBILE_NAV} a[href="/roadmap"]`).first()).toBeHidden()
})

test('the community marquee stops under prefers-reduced-motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

  // The carousel mounts behind a deferred boundary once the section approaches
  // the viewport, so the element only exists after the island loads.
  const track = page.locator('[class*="marquee"] [class*="track"]').first()
  await track.waitFor({ state: 'attached', timeout: 20_000 })

  const animation = await track.evaluate((el) => getComputedStyle(el).animationName)
  expect(animation, 'the marquee keyframes must not run under reduced motion').toBe('none')
})
