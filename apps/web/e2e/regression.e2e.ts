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

  // The walk must start at the skip link (WCAG 2.4.1 bypass for the repeated
  // header), then the logo, the three group disclosures, and the action button
  // in DOM order — the whole header is keyboard-operable.
  expect(focused.slice(0, 6)).toEqual([
    '#main-content',
    '/',
    'summary',
    'summary',
    'summary',
    '/app',
  ])

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

test('desktop navbar closes sibling and outside disclosures and gains its scroll surface', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'the desktop menu is hidden below md')
  await page.goto('/')

  const header = page.locator('#nifty-navbar-scroll-frame')
  const details = page.locator(`${DESKTOP_MENU} details`)
  await expect(header).toHaveAttribute('data-scrolled', 'false')

  await expect
    .poll(() =>
      details
        .nth(0)
        .locator('a')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href')))
    )
    .toEqual(['/games', '/niftyworld', '/degens', '/compete-and-earn'])
  await expect
    .poll(() => details.nth(2).locator('a').first().getAttribute('href'))
    .toBe('/community')
  await expect
    .poll(() => details.nth(2).locator('a').nth(1).getAttribute('href'))
    .toBe('https://github.com/NiftyLeague')
  await expect(details.nth(2).locator('a').nth(1).locator('span').first()).toHaveText('GitHub')

  await page.evaluate(() => window.scrollTo(0, 200))
  await expect.poll(() => header.getAttribute('data-scrolled')).toBe('true')
  await expect
    .poll(() => header.evaluate((element) => getComputedStyle(element).backgroundColor))
    .not.toBe('rgba(0, 0, 0, 0)')

  await details.nth(0).locator('summary').click()
  await expect(details.nth(0)).toHaveAttribute('open', '')
  await details.nth(1).locator('summary').click()
  await expect(details.nth(0)).not.toHaveAttribute('open', '')
  await expect(details.nth(1)).toHaveAttribute('open', '')

  await page.mouse.click(700, 700)
  await expect(details.nth(1)).not.toHaveAttribute('open', '')

  await details.nth(2).locator('summary').click()
  await page.keyboard.press('Escape')
  await expect(details.nth(2)).not.toHaveAttribute('open', '')
})

test('desktop marketing buttons keep their large responsive size', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'the desktop menu is hidden below md')
  await page.goto('/')

  const button = page.locator('#gaming-section a').first()
  await expect(button).toBeVisible()
  await expect(button).toHaveCSS('height', '70px')
  await expect(button).toHaveCSS('width', '240px')
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

test('the mobile drawer stays fixed and scrolls independently', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'the drawer is the compact-viewport nav')
  await page.goto('/niftyworld')

  await expect(page.locator('#nifty-navbar-scroll-frame')).toHaveCount(1)

  const toggle = page.locator(MOBILE_TOGGLE)
  await toggle.click()
  const panel = page.locator(MOBILE_NAV)
  const header = page.locator('#nifty-navbar-scroll-frame')
  await expect(panel).toBeVisible()
  await expect(panel).toHaveCSS('position', 'fixed')
  await expect(panel).toHaveCSS('overflow-y', 'auto')
  await expect
    .poll(() => header.evaluate((element) => getComputedStyle(element).backgroundColor))
    .not.toBe('rgba(0, 0, 0, 0)')
  await expect
    .poll(() => header.evaluate((element) => getComputedStyle(element).backdropFilter))
    .toBe('none')

  const rootOverflow = await page.evaluate(() => ({
    html: getComputedStyle(document.documentElement).overflowY,
    body: getComputedStyle(document.body).overflowY,
  }))
  expect(rootOverflow).toEqual({ html: 'hidden', body: 'hidden' })

  const panelMetrics = await panel.evaluate((element) => ({
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
    top: element.getBoundingClientRect().top,
  }))
  expect(panelMetrics.scrollHeight).toBeGreaterThan(panelMetrics.clientHeight)

  await page.mouse.move(215, 40)
  await page.mouse.wheel(0, 500)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  await expect
    .poll(() => panel.evaluate((element) => element.clientHeight))
    .toBe(panelMetrics.clientHeight)

  await page.mouse.move(215, 500)
  await page.mouse.wheel(0, 500)
  await expect.poll(() => panel.evaluate((element) => element.scrollTop)).toBeGreaterThan(0)
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)

  await panel.evaluate((element) => {
    element.scrollTop = element.scrollHeight
  })
  await expect.poll(() => panel.evaluate((element) => element.scrollTop)).toBeGreaterThan(0)

  await toggle.click()
  await expect(panel).toBeHidden()
  await expect
    .poll(() =>
      page.evaluate(() => ({
        html: getComputedStyle(document.documentElement).overflowY,
        body: getComputedStyle(document.body).overflowY,
      }))
    )
    .toEqual({ html: 'visible', body: 'visible' })
})

test('the mobile drawer fills the viewport after the page has scrolled', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'the drawer is the compact-viewport nav')
  await page.goto('/')

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)

  await page.locator(MOBILE_TOGGLE).click()
  const panel = page.locator(MOBILE_NAV)
  const viewportHeight = page.viewportSize()?.height ?? 852

  await expect(panel).toBeVisible()
  await expect
    .poll(() => panel.evaluate((element) => element.getBoundingClientRect().height))
    .toBeGreaterThan(viewportHeight - 120)
  await expect
    .poll(() => panel.evaluate((element) => Math.round(element.getBoundingClientRect().bottom)))
    .toBe(viewportHeight)
})

test('mobile marketing pages keep one document scroll surface', async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name !== 'mobile',
    'the extra scroll surface is a mobile-only regression'
  )
  await page.goto('/niftyworld')

  const overflow = await page.evaluate(() =>
    ['html', 'body', 'main', 'footer'].map((selector) => {
      const element = document.querySelector(selector) as HTMLElement | null
      return [selector, element ? getComputedStyle(element).overflowY : null]
    })
  )

  expect(overflow).toEqual([
    ['html', 'visible'],
    ['body', 'visible'],
    ['main', 'visible'],
    ['footer', 'visible'],
  ])
})

test('the homepage cast ribbon stops under prefers-reduced-motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')

  // The cast ribbon mounts behind a deferred boundary once its section approaches
  // the viewport. Walk the page in viewport steps until the island loads.
  const track = page.locator('[data-home-section="characters"] .home-v3-cast-track').first()
  for (let step = 0; step < 20 && (await track.count()) === 0; step += 1) {
    await page.evaluate(() => window.scrollBy(0, 700))
    await page.waitForTimeout(200)
  }
  await track.waitFor({ state: 'attached', timeout: 20_000 })

  const animation = await track.evaluate((el) => getComputedStyle(el).animationName)
  expect(animation, 'the marquee keyframes must not run under reduced motion').toBe('none')
})
