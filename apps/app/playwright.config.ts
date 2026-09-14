import { defineConfig, devices } from '@playwright/test'

/** Browser E2E for apps/app using the Nitro node-server build. */
export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: false,
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:3000', trace: 'retain-on-failure' },
  outputDir: 'artifacts/playwright',
  reporter: [['list'], ['html', { outputFolder: 'artifacts/playwright-report', open: 'never' }]],
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command:
      'VITE_AUDIT_FIXTURE=true NITRO_PRESET=node-server bun run build && PORT=3000 node .output/server/index.mjs',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
