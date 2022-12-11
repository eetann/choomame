import { test, expect } from "./fixtures.js";

test("onInstalled test", async ({ page }) => {
  await page.goto("https://www.google.com/search?q=hoge");

  // onInstalled languages
  for (const language of ["Any", "English", "Japanese"]) {
    await expect(page.locator("#choomameRoot")).toHaveText(
      new RegExp(language)
    );
  }

  // onInstalled times
  for (const times of [
    "Any",
    "1 day",
    "1 month",
    "6 month",
    "1 week",
    "3 year",
  ]) {
    await expect(page.locator("#choomameRoot")).toHaveText(new RegExp(times));
  }
});

test("Languages test", async ({ page, extensionId }) => {
  // add new language
  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.locator("_react=App >> text='Language'").click();
  await page
    .locator("_react=LanguagesForm >> select")
    .selectOption({ label: "French" });
  await page
    .locator("_react=LanguagesForm >> _react=[aria-label = 'Add language']")
    .click();

  // remove language
  await page
    .locator(
      "_react=LanguagesTable >> tr:has-text('Japanese') >> _react=[aria-label = 'Delete language']"
    )
    .click();

  // check
  await page.goto("https://www.google.com/search?q=hoge");
  for (const language of ["Any", "English", "French"]) {
    await expect(page.locator("#choomameRoot")).toHaveText(
      new RegExp(language)
    );
  }

  // reset languages
  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.locator("_react=App >> text='Language'").click();
  await page.locator("_react=LanguagesReset >> text='Reset'").click();
  await page.locator("text='Yes, reset.'").click();

  // check
  await page.goto("https://www.google.com/search?q=hoge");
  for (const language of ["Any", "English", "Japanese"]) {
    await expect(page.locator("#choomameRoot")).toHaveText(
      new RegExp(language)
    );
  }
});

test("Times test", async ({ page, extensionId }) => {
  // add new time
  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.locator("_react=App >> text='Time'").click();
  await page.locator("_react=TimesForm >> #timeNumber").fill("3");
  await page
    .locator("_react=TimesForm >> select")
    .selectOption({ label: "day" });
  await page
    .locator("_react=TimesForm >> _react=[aria-label = 'Add time']")
    .click();

  // remove time
  await page
    .locator(
      "_react=TimesTable >> tr:has-text('6 month') >> _react=[aria-label = 'Delete time']"
    )
    .click();

  // check
  await page.goto("https://www.google.com/search?q=hoge");
  for (const time of [
    "Any",
    "1 day",
    "3 day",
    "1 week",
    "1 month",
    "1 year",
    "3 year",
  ]) {
    await expect(page.locator("#choomameRoot")).toHaveText(new RegExp(time));
  }

  // reset times
  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.locator("_react=App >> text='Time'").click();
  await page.locator("_react=TimesReset >> text='Reset'").click();
  await page.locator("text='Yes, reset.'").click();

  // check
  await page.goto("https://www.google.com/search?q=hoge");
  for (const time of [
    "Any",
    "1 day",
    "1 month",
    "6 month",
    "1 week",
    "3 year",
  ]) {
    await expect(page.locator("#choomameRoot")).toHaveText(new RegExp(time));
  }
});
