import { test, expect } from "./fixtures.js";
import { initialLanguagesStorage } from "../src/features/languages/languages.js";

test('example test', async ({ page }) => {
  // onInstalled
  await page.waitForTimeout(3000)

  await page.goto('https://www.google.com/search?q=hoge');
  for (const language of ["Any", "English", "Japanese"]) {
    await expect(page.locator('#choomameRoot')).toHaveText(new RegExp(language));
  }
});

// test('popup page', async ({ page, extensionId }) => {
//   await page.goto(`chrome-extension://${extensionId}/index.html`);
//   await expect(page.locator('body')).toHaveText('Choomame');
// });
