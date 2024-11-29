const { test, expect } = require("@playwright/test");

test.use({
  geolocation: { latitude: 51.107883, longitude: 17.038538 },
  permissions: ["geolocation"],
});

test("Exercise 3 - Google Playwright getting started with geolocation (Wroclaw)", async ({
  page,
}) => {
  await page.goto("https://www.google.pl/?hl=pl");

  const cookieBtn = await page.locator("#L2AGLb");
  if (await cookieBtn.isVisible()) {
    await cookieBtn.click();
  } else {
    console.log("🍪 Cookie button is not visible");
  }

  const searchBarEnglish = await page.getByRole("textbox", { name: "Search" });
  const searchBarPolish = await page.getByLabel("Szukaj", { exact: true });

  if (await searchBarEnglish.isVisible()) {
    await searchBarEnglish.fill("Playwright getting started");
    console.log("😊  searchbar in english is working!");
    await searchBarEnglish.press("Enter");
  } else if (await searchBarPolish.isVisible()) {
    console.log("😍  searchbar2 in polish is working! ");
    await searchBarPolish.fill("Playwright getting started");
    await searchBarPolish.press("Enter");
  } else {
    throw new Error("💀 Search bar is not found!");
  }

  //all links have same class LC20lb :
  //<h3 class="LC20lb MBeuO DKV0Md">Installation | Playwright</h3>
  await page.waitForSelector(".LC20lb");
  let linksNames = await page.locator(".LC20lb").allInnerTexts(); //Promise<Array<string>> - we extract names of all links

  console.log(" ✅ names of links are: ", linksNames);

  expect(linksNames).toContain("Installation | Playwright");
});
