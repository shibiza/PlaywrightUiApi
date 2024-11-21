// @ts-check
const { test, expect } = require('@playwright/test');

test.skip('Exercise 3  -  Google Playwright getting started', async ({ page }) => {
  await page.goto('https://www.google.pl/?hl=pl');

  const cookieBtn = await page.locator("#L2AGLb");
  cookieBtn.click();

  const searchBar = await page.getByRole('button', {name :'Search'});
 // searchBar.click();
 
  searchBar.fill('Playwright getting started');
});
