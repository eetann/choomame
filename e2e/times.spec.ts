import { test, expect } from "./fixtures.js";

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
  await page.locator(["_react=App", "text='Time'"].join(" >> ")).click();

  await test.step("add new Time", async () => {
    await page
      .locator(["_react=TimesForm", "#timeNumber"].join(" >> "))
      .fill("3");
    await page
      .locator(["_react=TimesForm", "select"].join(" >> "))
      .selectOption({ label: "day" });
    await page
      .locator(
        ["_react=TimesForm", "_react=[aria-label = 'Add time']"].join(" >> ")
      )
      .click();
  });

  await test.step("remove Time", async () => {
    await page
      .locator(
        [
          "_react=TimesTable",
          "tr:has-text('6 month')",
          "_react=[aria-label = 'Delete time']",
        ].join(" >> ")
      )
      .click();
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
  await page.locator(["_react=App", "text='Time'"].join(" >> ")).click();

  await test.step("reset Time", async () => {
    await page
      .locator(
        ["_react=ResetButton[name = 'Time']", "text='Reset'"].join(" >> ")
      )
      .click();
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
