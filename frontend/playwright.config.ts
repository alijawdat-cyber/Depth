import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  testDir: './tests/visual',
  use: {
    baseURL: 'http://localhost:3030',
    viewport: { width: 1280, height: 800 },
    screenshot: 'only-on-failure',
  },
};

export default config;
