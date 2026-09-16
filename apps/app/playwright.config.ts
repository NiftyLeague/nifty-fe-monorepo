import { defineConfig, devices } from '@playwright/test'

/**
 * Browser E2E for apps/app using the Nitro node-server build.
 *
 * The port is configurable because 3000 is commonly squatted by unrelated
 * dev servers; against the wrong server these suites "pass" or fail
 * meaninglessly. Set APP_E2E_PORT and APP_E2E_REUSE_SERVER when a real
 * fixture server is already running on that port.
 */
const PORT = process.env.APP_E2E_PORT ?? '3000'
const BASE_URL = `http://127.0.0.1:${PORT}`
const REUSE_SERVER = process.env.APP_E2E_REUSE_SERVER === 'true'

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: false,
  workers: 1,
  use: { baseURL: BASE_URL, trace: 'retain-on-failure' },
  outputDir: 'artifacts/playwright',
  reporter: [['list'], ['html', { outputFolder: 'artifacts/playwright-report', open: 'never' }]],
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `VITE_AUDIT_FIXTURE=true NITRO_PRESET=node-server bun run build && PORT=${PORT} node .output/server/index.mjs`,
    url: BASE_URL,
    reuseExistingServer: REUSE_SERVER || !process.env.CI,
    timeout: 180_000,
  },
})
