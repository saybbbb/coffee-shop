import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end checks for the Nurvana Café site.
 *   npm run test:e2e   → smoke tests on a laptop and a phone viewport
 *   npm run screens    → full-section screenshots into e2e/screens/ (not committed)
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: 0,
  reporter: [["list"]],
  timeout: 60_000,
  use: {
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
  },
  // Tests the production build (what visitors get) on its own port, so it never
  // clashes with `npm run dev` on 3000 and has no dev-only overlays in the way
  webServer: {
    command: "npm run build && npm run start -- -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: true,
    timeout: 240_000,
  },
  projects: [
    { name: "laptop", use: { ...devices["Desktop Chrome"], viewport: { width: 1366, height: 768 } } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
});
