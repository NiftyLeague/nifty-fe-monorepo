import { test, expect } from '@playwright/test'

const routes = [
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

test('all marketing documents have crawlable HTML and production canonicals', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  const titles = new Set<string>()
  const descriptions = new Set<string>()
  for (const route of routes) {
    const response = await page.goto(`${baseURL}${route}`)
    expect(response?.status(), route).toBe(200)
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://niftyleague.com${route}`
    )
    const title = await page.title()
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(title).toContain('Nifty League')
    expect(description, `${route} metadata description`).toBeTruthy()
    titles.add(title)
    descriptions.add(description!)
    expect((await page.locator('main').innerText()).trim().length, route).toBeGreaterThan(40)
  }
  expect(titles.size, 'marketing route titles must be unique').toBe(routes.length)
  expect(descriptions.size, 'marketing route descriptions must be unique').toBe(routes.length)
  await context.close()
})

test('home hydrates without Next requests or console errors', async ({ page }, testInfo) => {
  const errors: string[] = []
  const nextRequests: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('request', (request) => {
    if (request.url().includes('/_next/')) nextRequests.push(request.url())
  })
  await page.goto('/')
  await expect(page.locator('main')).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('hero.png') })
  await page.locator('footer').scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
  expect(errors).toEqual([])
  expect(nextRequests).toEqual([])
  await page.screenshot({ path: testInfo.outputPath('footer.png') })
})

test('Nifty World exposes live explore and docs actions', async ({ page }) => {
  await page.goto('/niftyworld')

  const exploreLinks = page.getByRole('link', { name: /^EXPLORE/ })
  await expect(exploreLinks).toHaveCount(2)
  await expect(exploreLinks.nth(0)).toHaveAttribute('href', '/app/world')
  await expect(exploreLinks.nth(1)).toHaveAttribute('href', '/app/world')
  await expect(exploreLinks.nth(0)).toHaveAttribute('target', '_blank')
  await expect(exploreLinks.nth(1)).toHaveAttribute('target', '_blank')

  const docsLink = page.getByRole('link', { name: /^VIEW DOCS/ })
  await expect(docsLink).toHaveCount(2)
  await expect(docsLink.nth(0)).toHaveAttribute('href', '/docs/overview/games/niftyworld')
  await expect(docsLink.nth(1)).toHaveAttribute('href', '/docs/overview/games/niftyworld')
  await expect(page.getByRole('link', { name: /^VIEW MORE/ })).toHaveCount(0)
  await expect(page.getByRole('link', { name: /^LEARN MORE/ })).toHaveCount(0)
  await expect(page.getByRole('button', { name: /^COMING SOON/ })).toHaveCount(0)
})

test('Games groups the lineup with direct game destinations', async ({ page }, testInfo) => {
  await page.goto('/games')

  const playNowLinks = page.getByRole('link', { name: /^PLAY NOW/ })
  await expect(playNowLinks).toHaveCount(2)
  await expect(playNowLinks.nth(0)).toHaveAttribute('href', '/app')
  await expect(playNowLinks.nth(1)).toHaveAttribute('href', '/app')
  await expect(playNowLinks.nth(0)).toHaveAttribute('target', '_blank')
  await expect(playNowLinks.nth(1)).toHaveAttribute('target', '_blank')

  const gameCards = page.locator('[data-game-name]')
  await expect(gameCards).toHaveCount(11)
  await expect(gameCards.first()).toHaveAttribute('data-game-name', 'NIFTY SMASHERS')

  const flagshipLink = gameCards.first().getByRole('link', { name: /NIFTY SMASHERS/ })
  await expect(flagshipLink).toHaveAttribute('href', 'https://niftysmashers.com')
  await expect(flagshipLink).toHaveAttribute('target', '_blank')

  const titleLinks = gameCards.locator('h2 > a')
  const expectedTags = [
    'MOBILE / PC',
    'OPEN WORLD',
    'MOBILE / PC',
    'BROWSER',
    'MINI-GAME',
    'MINI-GAME',
    'MINI-GAME',
    'MINI-GAME',
    'MINI-GAME',
    'MINI-GAME',
    'MINI-GAME',
  ]
  const expectedTitleLinks = [
    'https://niftysmashers.com',
    '/app/world',
    '/app',
    '/app/games/smashers',
    '/app/games/degen-dodge',
    '/app/games/wen-2d',
    '/app/games/wen-3d',
    '/app/games/mt-gawx',
    '/app/games/degen-dive',
    '/app/games/brick-breaker',
    '/app/games/tennis',
  ]

  await expect(titleLinks).toHaveCount(expectedTitleLinks.length)
  for (const [index, expectedHref] of expectedTitleLinks.entries()) {
    await expect(titleLinks.nth(index)).toHaveAttribute('href', expectedHref)
    await expect(titleLinks.nth(index).locator('svg')).toHaveCount(0)
    await expect(gameCards.nth(index).locator('h2')).toHaveCSS('white-space', 'nowrap')
    await expect(gameCards.nth(index).locator('p').first()).toHaveText(expectedTags[index])
  }

  if (testInfo.project.name === 'desktop') {
    const copyHeights = await gameCards.evaluateAll((cards) =>
      cards
        .slice(1)
        .map((card) => Math.round(card.children[0]?.getBoundingClientRect().height ?? 0))
    )
    expect(new Set(copyHeights).size).toBe(1)
  }

  const descriptionWidths = await gameCards.evaluateAll((cards) =>
    cards.map((card) => {
      const copy = card.children[0]
      const description = copy?.querySelector(':scope > p')
      const copyStyle = copy ? getComputedStyle(copy) : null
      const horizontalPadding = copyStyle
        ? Number.parseFloat(copyStyle.paddingLeft) + Number.parseFloat(copyStyle.paddingRight)
        : 0
      return {
        copy: Math.round((copy?.getBoundingClientRect().width ?? 0) - horizontalPadding),
        description: Math.round(description?.getBoundingClientRect().width ?? 0),
      }
    })
  )
  for (const { copy, description } of descriptionWidths) {
    expect(description).toBe(copy)
  }
})

test('marketing pages use the highlight purple accent for their key labels', async ({ page }) => {
  const accents = [
    { path: '/overview', selector: 'p', text: 'Learn how to navigate the Nifty League Platform' },
    { path: '/overview', selector: 'h2', text: 'GETTING STARTED' },
    { path: '/degens', selector: 'h2', text: 'FIRST CLASS CITIZENS' },
    { path: '/community', selector: 'h4', text: 'Nifty League' },
    { path: '/community', selector: 'h4', text: 'Discord' },
    { path: '/compete-and-earn', selector: 'h2', text: 'HOW IT WORKS' },
    { path: '/careers', selector: 'h3', text: 'JOIN NIFTY LEAGUE' },
    { path: '/team', selector: 'h1', text: 'NIFTY DAO' },
  ]

  for (const { path, selector, text } of accents) {
    await page.goto(path)
    const accent = page.locator(`${selector}:has-text("${text}")`).first()
    await expect(accent).toHaveClass(/text-highlight-purple/)
    await expect(accent).toHaveCSS('color', 'rgb(216, 194, 255)')
  }
})

test('Lore keeps its title white and positions Satoshi above the story panel', async ({ page }) => {
  await page.goto('/lore')

  const foreground = await page.evaluate(() => {
    const probe = document.createElement('span')
    document.body.append(probe)
    probe.style.color = 'var(--color-foreground)'
    const color = getComputedStyle(probe).color
    probe.remove()
    return color
  })
  await expect(page.getByRole('heading', { name: 'LORE' })).toHaveCSS('color', foreground)

  const viewportWidth = page.viewportSize()?.width ?? 0
  const expectedSatoshiTop =
    viewportWidth <= 420
      ? '260px'
      : viewportWidth <= 768
        ? '165px'
        : viewportWidth <= 920
          ? '155px'
          : '145px'
  const satoshiContainer = page.locator('img[alt="Satoshi"]').locator('..').locator('..')
  await expect(satoshiContainer).toHaveCSS('top', expectedSatoshiTop)
})

test('roadmap reflects the updated milestone phases and outcomes', async ({ page }) => {
  await page.goto('/roadmap')

  const themeColors = await page.evaluate(() => {
    const probe = document.createElement('span')
    document.body.append(probe)
    probe.style.color = 'var(--color-foreground)'
    const foreground = getComputedStyle(probe).color
    probe.style.color = 'var(--color-highlight-purple)'
    const highlight = getComputedStyle(probe).color
    probe.remove()
    return { foreground, highlight }
  })
  await expect(page.getByRole('heading', { name: 'Nifty League Moonmap' })).toHaveCSS(
    'color',
    themeColors.foreground
  )

  const cards = page.locator('[data-roadmap-card]')
  const titles = await cards.locator('h3').allTextContents()
  const indexOf = (title: string) => titles.findIndex((candidate) => candidate.trim() === title)
  await expect(cards.locator('h3').first()).toHaveCSS('color', themeColors.highlight)

  expect(indexOf('Nifty Royale - Alpha')).toBeGreaterThanOrEqual(0)
  expect(indexOf('Nifty Smashers - Global Launch')).toBeGreaterThanOrEqual(0)
  expect(indexOf('Nifty Royale - Alpha')).toBeLessThan(indexOf('Nifty Smashers - Global Launch'))
  expect(indexOf('Nifty World - Alpha')).toBeLessThan(indexOf('Nifty World - Beta'))
  expect(indexOf('Nifty World - Beta')).toBeLessThan(indexOf('Items Marketplace'))
  expect(indexOf('Items Marketplace')).toBeLessThan(indexOf('Land'))

  const royaleAlpha = page.locator('[data-roadmap-card][data-roadmap-title="Nifty Royale - Alpha"]')
  await expect(royaleAlpha).toHaveAttribute('data-roadmap-status', 'completed')
  await expect(royaleAlpha).toContainText('April 20th, 2025')

  const smashersLaunch = page.locator(
    '[data-roadmap-card][data-roadmap-title="Nifty Smashers - Global Launch"]'
  )
  await expect(smashersLaunch).toHaveAttribute('data-roadmap-status', 'cancelled')
  await expect(smashersLaunch).toContainText('Cancelled')
  await expect(smashersLaunch).toContainText('June 1st, 2025')
  await expect(smashersLaunch).toContainText('long-term retention')
  await expect(smashersLaunch).toContainText('publisher support')
  const cancelledCheckpoint = smashersLaunch.locator('[class*="cd_timeline_checkpoint"]')
  const cancelledStyles = await cancelledCheckpoint.evaluate((element) => {
    const icon = element.querySelector('svg')
    const styles = getComputedStyle(element)
    return {
      backgroundColor: styles.backgroundColor,
      backgroundImage: styles.backgroundImage,
      boxShadow: styles.boxShadow,
      foregroundColor: styles.color,
      iconColor: icon ? getComputedStyle(icon).color : '',
    }
  })
  const statusColors = await page.evaluate(() => {
    const probe = document.createElement('span')
    document.body.append(probe)
    probe.style.backgroundColor = 'var(--color-error)'
    const errorColor = getComputedStyle(probe).backgroundColor
    probe.style.backgroundColor = 'transparent'
    probe.style.borderColor = 'var(--color-purple)'
    const purpleColor = getComputedStyle(probe).borderColor
    probe.style.color = 'var(--color-foreground)'
    const foregroundColor = getComputedStyle(probe).color
    probe.remove()
    return { errorColor, purpleColor, foregroundColor }
  })
  expect(cancelledStyles.backgroundColor).toBe(statusColors.errorColor)
  expect(cancelledStyles.backgroundImage).toBe('none')
  expect(cancelledStyles.iconColor).toBe(statusColors.foregroundColor)
  expect(cancelledStyles.boxShadow).toContain(statusColors.purpleColor)

  const worldAlpha = page.locator('[data-roadmap-card][data-roadmap-title="Nifty World - Alpha"]')
  await expect(worldAlpha).toHaveAttribute('data-roadmap-status', 'completed')
  await expect(worldAlpha).toContainText('Sept 12th, 2026')
  await expect(worldAlpha).toContainText('Three.js')
  await expect(worldAlpha).toContainText('niftyleague.com/app/world')

  const worldBeta = page.locator('[data-roadmap-card][data-roadmap-title="Nifty World - Beta"]')
  await expect(worldBeta).toHaveAttribute('data-roadmap-status', 'current')
  await expect(worldBeta).toContainText('gamified social hub')
  const worldAlphaImage = worldAlpha.locator('[class*="timeline_content_img"]')
  const worldBetaImage = worldBeta.locator('[class*="timeline_content_img"]')
  await expect(worldAlphaImage).toHaveCount(1)
  await expect(worldBetaImage).toHaveCount(1)
  await expect(worldAlphaImage).toHaveAttribute('style', /top:\s*-165px/)
  await expect(worldBetaImage).toHaveAttribute('style', /top:\s*-165px/)
  expect(await worldBetaImage.locator('img').getAttribute('src')).toBe(
    await worldAlphaImage.locator('img').getAttribute('src')
  )
  expect(await worldBetaImage.getAttribute('style')).toBe(
    await worldAlphaImage.getAttribute('style')
  )
  await expect(worldBeta.locator('[class*="satoshiStationary"]')).toHaveCount(1)

  await expect(
    page.locator('[data-roadmap-card][data-roadmap-title="Items Marketplace"]')
  ).toHaveAttribute('data-roadmap-status', 'planned')
  await expect(
    page.locator('[data-roadmap-card][data-roadmap-title="Land"] [class*="timeline_content_img"]')
  ).toHaveAttribute('style', /top:\s*90px/)
})

test('Compete & Earn keeps the token section first and the governance section last', async ({
  page,
}) => {
  await page.goto('/compete-and-earn')

  const tokenHeading = page.getByRole('heading', { name: 'NFTL TOKEN', level: 1 })
  await expect(tokenHeading).toBeVisible()
  await expect(page.getByRole('img', { name: 'Compete and Earn logo' })).toBeAttached()
  const themeColors = await page.evaluate(() => {
    const probe = document.createElement('span')
    document.body.append(probe)
    probe.style.color = 'var(--color-foreground)'
    const foreground = getComputedStyle(probe).color
    probe.style.color = 'var(--color-highlight-purple)'
    const highlight = getComputedStyle(probe).color
    probe.remove()
    return { foreground, highlight }
  })
  await expect(tokenHeading).toHaveCSS('color', themeColors.foreground)
  const gameModes = page.locator('main.compete-pg section').filter({ hasText: 'GAME MODES' })
  await expect(gameModes.locator('h3')).toHaveCSS('color', themeColors.foreground)
  for (const header of ['FEATURES:', 'PUBLIC', 'PRIVATE']) {
    await expect(gameModes.locator('h4').filter({ hasText: header })).toHaveCSS(
      'color',
      themeColors.highlight
    )
  }
  const headings = (
    await page
      .locator('main.compete-pg h1, main.compete-pg h2, main.compete-pg h3')
      .allTextContents()
  ).map((heading) => heading.replace(/\s+/g, ' ').trim())

  expect(headings[0]?.trim()).toBe('NFTL TOKEN')
  expect(headings.at(-1)).toContain('GOVERN TOGETHER')
  expect(headings.indexOf('GAME MODES')).toBeLessThan(headings.length - 1)
  await expect(
    page.getByText('Compete, earn, and help govern the future of the Nifty League ecosystem.', {
      exact: true,
    })
  ).toHaveCount(1)
  await expect(page.getByRole('heading', { name: /SMASHERS/ })).toHaveCount(0)
})

test('Compete & Earn hydrates its video loader but keeps YouTube out of the initial document', async ({
  request,
}) => {
  const html = await (await request.get('/compete-and-earn')).text()
  const videoSourceIndex = html.indexOf('youtube-nocookie.com/embed/wv_fI1PPBi0')
  const islandStart = html.lastIndexOf('<astro-island', videoSourceIndex)
  const islandEnd = html.indexOf('</astro-island>', videoSourceIndex)
  const videoIsland = html.slice(islandStart, islandEnd)

  expect(videoIsland).toContain('client="load"')
  // The deferred facade renders the status skeleton server-side and only
  // mounts the third-party iframe once the section nears the viewport; the
  expect(videoIsland).not.toContain('<iframe')
  expect(videoIsland).toContain('aria-label="Loading Nifty League Compete')
})

test('mobile Compete & Earn loads the video once it nears the viewport', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'the video shell regression is mobile-specific')
  await page.goto('/compete-and-earn')

  // The video sits inside the first viewport on the compact layout, so the
  // facade swaps from the status skeleton to the player without scrolling.
  // The swap must happen through hydration only: the initial document ships
  // the skeleton, never the third-party iframe.
  const video = page.locator('iframe[src*="wv_fI1PPBi0"]')
  await expect(video).toBeVisible()
  await expect(
    page.getByRole('status', { name: 'Loading Nifty League Compete & Earn' })
  ).toHaveCount(0)
})

test('mobile home keeps the historical intro background focal point', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'the compact viewport uses the mobile intro crop')
  await page.goto('/')

  await expect(page.locator('.home-intro-background img')).toHaveCSS('object-position', '0% 0%')
})

test('mobile Compete & Earn removes the game modes spacer', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'the compact viewport hides the comparison table')
  await page.goto('/compete-and-earn')

  const gameModes = page.locator('main.compete-pg section').filter({ hasText: 'GAME MODES' })
  await expect(gameModes).toHaveCount(1)
  await expect(gameModes).toHaveCSS('display', 'none')
})

test('desktop navigation keeps every dropdown description on one line', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'the desktop dropdown is hidden below md')
  await page.goto('/roadmap')

  const groups = page.locator('nav[aria-label="Primary navigation"] details')
  for (const group of await groups.all()) {
    await group.locator('summary').click()
  }

  const descriptions = page.locator('nav[aria-label="Primary navigation"] details li span.text-xs')
  await expect(descriptions).not.toHaveCount(0)
  for (const description of await descriptions.all()) {
    await expect(description).toHaveCSS('white-space', 'nowrap')
    expect(await description.evaluate((element) => element.scrollWidth)).toBeLessThanOrEqual(
      await description.evaluate((element) => element.clientWidth)
    )
  }
})

test('GLTF initially presents its server-supplied token poster without fetching the 3D runtime', async ({
  page,
}) => {
  const modelRequests: string[] = []
  page.on('request', (request) => {
    if (/model-viewer|\.gltf(?:\?|$)|\.glb(?:\?|$)/i.test(request.url()))
      modelRequests.push(request.url())
  })
  await page.goto('/gltf/1')
  await expect(page.locator('[data-gltf-poster]')).toHaveAttribute(
    'src',
    /\/img\/degens\/nfts\/1\.(webp|gif)$/
  )
  await page.waitForTimeout(500)
  expect(modelRequests).toEqual([])
  await expect(page.getByLabel('Toggle 3D')).toBeVisible()
})

test('modules support the opaque origin used by embedded GLTF viewers', async ({ request }) => {
  const html = await (await request.get('/gltf/1')).text()
  const module = html.match(/(?:src|component-url)="([^"]*\/_astro\/[^"]+\.js)"/)?.[1]
  expect(module).toBeTruthy()
  const response = await request.get(module!, { headers: { Origin: 'null' } })
  expect(response.headers()['access-control-allow-origin']).toBe('*')
})

test('unknown routes and private shell documents are not soft-200 pages', async ({ request }) => {
  expect((await request.get('/not-a-real-page')).status()).toBe(404)
  expect((await request.get('/shells/gltf.html')).status()).toBe(404)
  expect((await request.get('/gltf/not-a-token')).status()).toBe(404)
})
