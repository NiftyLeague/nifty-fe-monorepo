import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  fullyParallel: false,
  workers: 1,
  use: { baseURL: 'http://127.0.0.1:4337', trace: 'retain-on-failure' },
  outputDir: 'artifacts/playwright',
  reporter: [['list'], ['html', { outputFolder: 'artifacts/playwright-report', open: 'never' }]],
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'bunx wrangler dev --local --port 4337',
    url: 'http://127.0.0.1:4337',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
