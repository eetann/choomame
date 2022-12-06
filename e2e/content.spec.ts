import { test, expect } from "./fixtures.js";
import { initialLanguagesStorage, languagesKeyValue } from "../src/features/languages/languagesSchema.js";
import { getTimeText, initialTimesStorage } from "../src/features/times/timesSchema.js";

test('onInstalled test', async ({ page }) => {
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

test('Languages test', async ({ page, extensionId }) => {
  // add new language
  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.locator("_react=App >> text='Language'").click()
  await page.locator("_react=LanguagesForm >> select").selectOption({label:"French"})
  await page.locator("_react=LanguagesForm >> _react=[aria-label = 'Add language']").click()

  await page.goto('https://www.google.com/search?q=hoge');

  for (const language of [...initialLanguagesStorage.languages, "lang_fr"]) {
    await expect(page.locator('#choomameRoot')).toHaveText(new RegExp(languagesKeyValue[language]));
  }
});
