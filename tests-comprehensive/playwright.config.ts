import { defineConfig, devices } from '@playwright/test';

/**
 * Comprehensive Playwright configuration for Bug Tracker testing
 * Supports both API and UI testing with multiple browsers
 */
export default defineConfig({
  testDir: './',
  
  // Maximum time one test can run
  timeout: 30 * 1000,
  
  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Reporters
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list'],
  ],
  
  // Shared settings for all tests
  use: {
    // Base URL for UI tests
    baseURL: process.env.UI_BASE_URL || 'http://localhost:3000',
    
    // API endpoint
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
    
    // Screenshots and traces
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    
    // Timeouts
    actionTimeout: 10 * 1000,
    navigationTimeout: 30 * 1000,
  },

  // Configure projects for major browsers and API testing
  projects: [
    {
      name: 'API Tests',
      testMatch: /.*api.*\.spec\.ts/,
      use: {
        baseURL: process.env.API_BASE_URL || 'http://localhost:8080/api',
      },
    },
    
    {
      name: 'chromium',
      testMatch: /.*ui.*\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: 'firefox',
      testMatch: /.*ui.*\.spec\.ts/,
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: 'webkit',
      testMatch: /.*ui.*\.spec\.ts/,
      use: { 
        ...devices['Desktop Safari'],
        viewport: { width: 1280, height: 720 },
      },
    },

    // Mobile viewports
    {
      name: 'Mobile Chrome',
      testMatch: /.*ui.*\.spec\.ts/,
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      testMatch: /.*ui.*\.spec\.ts/,
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Run local dev server before starting tests (optional)
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});
