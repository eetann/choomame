import { test, expect } from "./fixtures.js";
import { locator } from "./helper.js";

test("Times", async ({ page, extensionId }) => {
  await page.goto("https://www.google.com/search?q=typescript+record");

  await test.step("onInstalled", async () => {
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

  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await locator(page, ["_react=App", "text='Time'"]).click();

  await test.step("add new Time", async () => {
    await locator(page, ["_react=TimesForm", "#timeNumber"]).fill("3");
    await locator(page, ["_react=TimesForm", "select"]).selectOption({
      label: "day",
    });
    await locator(page, [
      "_react=TimesForm",
      "_react=[aria-label = 'Add time']",
    ]).click();
  });

  await test.step("remove Time", async () => {
    await locator(page, [
      "_react=TimesTable",
      "tr:has-text('6 month')",
      "_react=[aria-label = 'Delete time']",
    ]).click();
  });

  await page.goto("https://www.google.com/search?q=hoge");

  await test.step("check @ content script", async () => {
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
  });

  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await locator(page, ["_react=App", "text='Time'"]).click();

  await test.step("reset Time", async () => {
    await locator(page, [
      "_react=ResetButton[name = 'Time']",
      "text='Reset'",
    ]).click();
    await page.locator("text='Yes, reset.'").click();
  });

  await page.goto("https://www.google.com/search?q=hoge");

  await test.step("check @ content script", async () => {
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
});
