import { test, expect } from "./fixtures.js";

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
  await page.locator(["_react=App", "text='Language'"].join(" >> ")).click();

  await test.step("add new Language", async () => {
    await page
      .locator(["_react=LanguagesForm", "select"].join(" >> "))
      .selectOption({ label: "French" });
    await page
      .locator(
        ["_react=LanguagesForm", "_react=[aria-label = 'Add language']"].join(
          " >> "
        )
      )
      .click();
  });

  await test.step("remove Language", async () => {
    await page
      .locator(
        [
          "_react=LanguagesTable",
          "tr:has-text('Japanese')",
          "_react=[aria-label = 'Delete language']",
        ].join(" >> ")
      )
      .click();
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
  await page.locator(["_react=App", "text='Language'"].join(" >> ")).click();

  await test.step("reset Languages", async () => {
    await page
      .locator(
        ["_react=ResetButton[name = 'Language']", "text='Reset'"].join(" >> ")
      )
      .click();
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
