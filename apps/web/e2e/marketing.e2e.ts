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
  for (const route of routes) {
    const response = await page.goto(`${baseURL}${route}`)
    expect(response?.status(), route).toBe(200)
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://niftyleague.com${route}`
    )
    expect(await page.title()).toContain('Nifty League')
    expect((await page.locator('main').innerText()).trim().length, route).toBeGreaterThan(40)
  }
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
