import { test, expect } from "./fixtures.js";
import { locator } from "./helper.js";

test("Languages", async ({ page, extensionId }) => {
  await test.step("onInstalled", async () => {
    await page.goto("https://www.google.com/search?q=typescript+record");

    for (const language of ["Any", "English", "Japanese"]) {
      await expect(page.locator("#choomameRoot")).toHaveText(
        new RegExp(language)
      );
    }
  });

  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await locator(page, ["_react=App", "text='Language'"]).click();

  await test.step("add new Language", async () => {
    await locator(page, ["_react=LanguagesForm", "select"]).selectOption({
      label: "French",
    });
    await locator(page, [
      "_react=LanguagesForm",
      "_react=[aria-label = 'Add language']",
    ]).click();
  });

  await test.step("remove Language", async () => {
    await locator(page, [
      "_react=LanguagesTable",
      "tr:has-text('Japanese')",
      "_react=[aria-label = 'Delete language']",
    ]).click();
  });

  await page.goto("https://www.google.com/search?q=hoge");

  await test.step("check @ content script", async () => {
    for (const language of ["Any", "English", "French"]) {
      await expect(page.locator("#choomameRoot")).toHaveText(
        new RegExp(language)
      );
    }
  });

  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await locator(page, ["_react=App", "text='Language'"]).click();

  await test.step("reset Languages", async () => {
    await locator(page, [
      "_react=ResetButton[name = 'Language']",
      "text='Reset'",
    ]).click();
    await page.locator("text='Yes, reset.'").click();
  });

  await page.goto("https://www.google.com/search?q=hoge");

  await test.step("check @ content script", async () => {
    for (const language of ["Any", "English", "Japanese"]) {
      await expect(page.locator("#choomameRoot")).toHaveText(
        new RegExp(language)
      );
    }
  });
});
