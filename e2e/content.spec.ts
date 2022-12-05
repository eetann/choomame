import { test, expect } from "./fixtures.js";
import { initialLanguagesStorage, languagesKeyValue } from "../src/features/languages/languagesSchema.js";
import { getTimeText, initialTimesStorage } from "../src/features/times/timesSchema.js";

test('onInstalled test', async ({ page }) => {
  // onInstalled
  await page.waitForTimeout(3000)

  await page.goto('https://www.google.com/search?q=hoge');

  // onInstalled languages
  for (const language of initialLanguagesStorage.languages) {
    await expect(page.locator('#choomameRoot')).toHaveText(new RegExp(languagesKeyValue[language]));
  }

  // onInstalled times
  for (const times of initialTimesStorage) {
    await expect(page.locator('#choomameRoot')).toHaveText(new RegExp(getTimeText(times.unit, times.number)));
  }
});
