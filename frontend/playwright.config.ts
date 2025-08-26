const config = {
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3030',
    viewport: { width: 1280, height: 800 },
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    port: 3030,
    reuseExistingServer: true,
    timeout: 120_000,
  }
};

export default config;
