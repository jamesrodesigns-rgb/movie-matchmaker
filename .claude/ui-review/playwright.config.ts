import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  timeout: 60_000,
  expect: { timeout: 5_000 },
  reporter: [['list']],
  use: {
    baseURL: process.env.UI_BASE_URL || 'http://localhost:3000',
    screenshot: 'only-on-failure',
    trace: 'off',
    video: 'off'
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
        colorScheme: 'light'
      }
    },
    {
      name: 'chromium-mobile',
      use: {
        ...devices['iPhone 12'],
        colorScheme: 'light'
      }
    }
  ],
  outputDir: './artifacts/_pw'
});