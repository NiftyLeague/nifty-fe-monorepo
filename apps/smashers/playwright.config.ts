import { defineConfig, devices } from '@playwright/test'

/**
 * Browser a11y sweep for apps/smashers (#1883).
 *
 * Production is the only serving story that matches what users get (SSR plus
 * the Vercel image optimizer — local `astro dev/preview` has neither), so the
 * suite runs against the live site; override with `SMASHERS_BASE_URL`. The
 * authenticated `/profile` surface needs a PlayFab session, which has no test
 * identity yet (#1915 dependency) — unauthenticated it correctly redirects to
 * `/login`, and that redirect is what the suite pins.
 */
export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: false,
  workers: 1,
  use: { baseURL: process.env.SMASHERS_BASE_URL ?? 'https://niftysmashers.com' },
  outputDir: 'artifacts/playwright',
  reporter: [['list'], ['html', { outputFolder: 'artifacts/playwright-report', open: 'never' }]],
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
})
