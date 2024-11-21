// @ts-check
const { test, expect, chromium } = require('@playwright/test');

test('Exercise 3 - Google Playwright getting started with geolocation (Wroclaw)', async () => {

  // Launch browser with geolocation settings for Wroclaw
  const context = await chromium.launchPersistentContext('', {
    geolocation: { latitude: 51.107883, longitude: 17.038538 },
    permissions: ['geolocation'],
  });

  const page = await context.newPage();

  await page.goto('https://www.google.pl/?hl=pl');

  const cookieBtn = await page.locator("#L2AGLb");
  await cookieBtn.click();

  const searchBar = await page.getByRole('textbox', { name: 'Search' });
  await searchBar.fill('Playwright getting started');

  // Clean up context
  await context.close();
});