import { defineConfig, devices } from "@playwright/experimental-ct-react";

export default defineConfig({
  testDir: "./src",
  testMatch: "**/*.ct.tsx",
  fullyParallel: true,
  timeout: 5_000,
  expect: { timeout: 2_000 },
  use: {
    actionTimeout: 2_000,
    ctPort: 3100,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
