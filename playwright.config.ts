import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e', // Der Ordner, in dem sich die Testdateien befinden
  timeout: 600000, // Zeitüberschreitung für jeden Test
  retries: 2, // Anzahl der Wiederholungen bei Testfehlern
  use: {
    headless: true, // Headless-Modus für die Tests
    viewport: { width: 1280, height: 720 },
    actionTimeout: 0, // Keine Zeitüberschreitung für Aktionen
    ignoreHTTPSErrors: true, // Ignorieren von HTTPS-Fehlern
  },
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    /*
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Webkit',
      use: { ...devices['Desktop Safari'] },
    },
    */
  ],
});
