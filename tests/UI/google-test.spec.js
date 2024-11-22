// @ts-check
const { test, expect } = require('@playwright/test');

test('Exercise 3 - Google Playwright getting started with geolocation (Wroclaw)', async ({ page }) => {
  await page.goto('https://www.google.com/');

  const cookieBtn = await page.locator("#L2AGLb");
  if (await cookieBtn.isVisible()) {
    await cookieBtn.click();
  } else {
    console.log('Cookie button not visible');
  }

  const searchBar = await page.getByRole('textbox', { name: 'Search' });
  const searchBar2 = await page.getByLabel('Szukaj', { exact: true });

 if(await searchBar.isVisible()){
  await searchBar.fill('Playwright getting started');
  console.log("searchbar in english is working");
  await searchBar.press('Enter');
}

  else if (await searchBar2.isVisible()){
    await searchBar2.fill('Playwright getting started');
    console.log("searchbar2 in polish is working");
    await searchBar2.press('Enter');

  }else {
    throw new Error("Search bar is not found");
  }

});