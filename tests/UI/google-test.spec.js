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
  if(await cookieBtn.isVisible()){
  await cookieBtn.click({timeout: 5000 });
  }else {
    console.log('Cookie button not visible');
  }
  
  const searchBar = await page.getByRole('textbox', { name: 'Search' });
  await searchBar.fill('Playwright getting started');

  // Clean up context
  await context.close();
});