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

test('Games labels Nifty World and exposes its app action as an external link', async ({
  page,
}) => {
  await page.goto('/games')
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

  const niftyWorldCard = page.locator('article').filter({
    has: page.getByRole('heading', { name: 'NIFTY WORLD', exact: true }),
  })
  await expect(niftyWorldCard).toHaveCount(1)

  const exploreWorld = niftyWorldCard.getByRole('link', { name: /^EXPLORE WORLD/ })
  await expect(exploreWorld).toHaveCount(1)
  await expect(exploreWorld).toHaveAttribute('href', '/app/world')
  await expect(exploreWorld).toHaveAttribute('target', '_blank')
  await expect(exploreWorld).toContainText('EXPLORE WORLD')
})

test('NFTL prioritizes the token section and leaves game modes last', async ({ page }) => {
  await page.goto('/compete-and-earn')

  await expect(page.getByRole('heading', { name: 'NFTL TOKEN', level: 1 })).toBeVisible()
  await expect(page.getByRole('img', { name: 'Compete and Earn logo' })).toBeAttached()
  const headings = await page
    .locator('main.compete-pg h1, main.compete-pg h2, main.compete-pg h3')
    .allTextContents()

  expect(headings[0]?.trim()).toBe('NFTL TOKEN')
  expect(headings.at(-1)?.trim()).toBe('GAME MODES')
  await expect(
    page.getByText('Compete, earn, and help govern the future of the Nifty League ecosystem.', {
      exact: true,
    })
  ).toHaveCount(1)
  await expect(page.getByRole('heading', { name: /SMASHERS/ })).toHaveCount(0)
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
