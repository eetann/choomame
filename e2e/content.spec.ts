import { test, expect } from "./fixtures.js";

test.describe("onInstalled", () => {
  test.beforeAll(async ({ page }) => {
    await page.goto("https://www.google.com/search?q=hoge");
  });

  test("Language", async ({ page }) => {
    for (const language of ["Any", "English", "Japanese"]) {
      await expect(page.locator("#choomameRoot")).toHaveText(
        new RegExp(language)
      );
    }
  });

  test("Time", async ({ page }) => {
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

  test.skip("customLink", async () => {
    // TODO: customLink
  });
});

test("Languages", async ({ page, extensionId }) => {
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

  await test.step("check @ content script", async () => {
    await page.goto("https://www.google.com/search?q=hoge");
    for (const language of ["Any", "English", "French"]) {
      await expect(page.locator("#choomameRoot")).toHaveText(
        new RegExp(language)
      );
    }
  });

  await test.step("reset Languages", async () => {
    await page.goto(`chrome-extension://${extensionId}/index.html`);
    await page.locator(["_react=App", "text='Language'"].join(" >> ")).click();
    await page
      .locator(
        ["_react=ResetButton[name = 'Language']", "text='Reset'"].join(" >> ")
      )
      .click();
    await page.locator("text='Yes, reset.'").click();
  });

  await test.step("check @ content script", async () => {
    await page.goto("https://www.google.com/search?q=hoge");
    for (const language of ["Any", "English", "Japanese"]) {
      await expect(page.locator("#choomameRoot")).toHaveText(
        new RegExp(language)
      );
    }
  });
});

test("Times", async ({ page, extensionId }) => {
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

  await test.step("check @ content script", async () => {
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
  });

  await test.step("reset Time", async () => {
    await page.goto(`chrome-extension://${extensionId}/index.html`);
    await page.locator(["_react=App", "text='Time'"].join(" >> ")).click();
    await page
      .locator(
        ["_react=ResetButton[name = 'Time']", "text='Reset'"].join(" >> ")
      )
      .click();
    await page.locator("text='Yes, reset.'").click();
  });

  await test.step("check @ content script", async () => {
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
});

test("CustomLink list", async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.locator(["_react=App", "text='Custom Link'"].join(" >> ")).click();

  await test.step("error handling: zod schema", async () => {
    await page.locator("#customLinkListURL").fill("aaaa");
    await page
      .locator(["_react=CustomLinkListForm", "text='Add'"].join(" >> "))
      .click();
    await expect(page.locator("_react=CustomLinkListForm")).toHaveText(
      /list's URL is invalid/
    );
  });

  await test.step("error handling: invalid JSON5 format", async () => {
    await page
      .locator("#customLinkListURL")
      .fill(
        "https://raw.githubusercontent.com/eetann/choomame-custom-link-list/main/src/developer.json5555"
      );
    await page
      .locator(["_react=CustomLinkListForm", "text='Add'"].join(" >> "))
      .click();
    await expect(page.locator("_react=CustomLinkListForm")).toHaveText(
      /The JSON5 in this URL is an invalid format/
    );
  });

  await test.step("add list", async () => {
    await page
      .locator("#customLinkListURL")
      .fill(
        "https://raw.githubusercontent.com/eetann/choomame-custom-link-list/main/src/eetann.json5"
      );
    await page
      .locator(["_react=CustomLinkListForm", "text='Add'"].join(" >> "))
      .click();
    await expect(page.locator("_react=CustomLinkListTable")).toHaveText(
      /eetann\(for E2E test\)/
    );
    for (const url of [
      "https://hub-eetann.vercel.app",
      "https://chrome.google.com/webstore/detail/lecnbgonlcmmpkpnngbofggjiccbnokn",
    ]) {
      await expect(page.locator("_react=CustomLinkTable")).toHaveText(
        new RegExp(url)
      );
    }
  });

  await test.step("check @ content script", async () => {
    // TODO: customLinkがcontent scriptで表示されるか確認
  });

  await test.step("remove list", async () => {
    await page
      .locator(
        [
          "_react=CustomLinkListTable",
          "tr:has-text('eetann(for E2E test)')",
          "_react=[aria-label = 'Delete custom link list']",
        ].join(" >> ")
      )
      .click();
    await expect(page.locator("_react=CustomLinkListTable")).not.toHaveText(
      /eetann\(for E2E test\)/
    );
    for (const url of [
      "https://hub-eetann.vercel.app",
      "https://chrome.google.com/webstore/detail/lecnbgonlcmmpkpnngbofggjiccbnokn",
    ]) {
      await expect(page.locator("_react=CustomLinkTable")).not.toHaveText(
        new RegExp(url)
      );
    }
  });

  await test.step("check @ content script", async () => {
    // TODO: customLinkがcontent scriptで表示されないか確認
  });
});

test("CustomLinks", async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.locator(["_react=App", "text='Custom Link'"].join(" >> ")).click();

  await test.step("error handling: zod schema", async () => {
    await page
      .locator("_react=CustomLinkForm")
      .getByLabel("Group name")
      .fill("a");
    await page.locator("_react=CustomLinkForm").getByLabel("Match").fill("a");
    await page
      .locator("_react=CustomLinkForm")
      .getByLabel("Link name")
      .fill("a");
    await page.locator("_react=CustomLinkForm").getByLabel("URL").fill("a");
    await expect(
      page.locator(["_react=CustomLinkForm", "text='Add'"].join(" >> "))
    ).toBeDisabled();
    await expect(page.locator("_react=CustomLinkForm")).toHaveText(
      /URL is invalid./
    );
  });

  await test.step("add new CustomLink", async () => {
    await page
      .locator("_react=CustomLinkForm")
      .getByLabel("Group name")
      .fill("Test group");
    await page.locator("_react=CustomLinkForm").getByLabel("Match").fill(".*");
    await page
      .locator("_react=CustomLinkForm")
      .getByLabel("Link name")
      .fill("eetann GitHub");
    await page
      .locator("_react=CustomLinkForm")
      .getByLabel("URL")
      .fill("https://github.com/eetann");
    await page
      .locator(["_react=CustomLinkForm", "text='Add'"].join(" >> "))
      .click();
  });

  test.step("check @ form", async () => {
    await expect(
      page.locator("_react=CustomLinkForm").getByLabel("Group name")
    ).toHaveValue("Test group");
    await expect(
      page.locator("_react=CustomLinkForm").getByLabel("Match")
    ).toHaveValue(".*");
    await expect(
      page.locator("_react=CustomLinkForm").getByLabel("Link name")
    ).toHaveValue("");
    await expect(
      page.locator("_react=CustomLinkForm").getByLabel("URL")
    ).toHaveValue("");
  });

  await test.step("toggle customLink", async () => {
    await page
      .locator(
        [
          "_react=CustomLinkTable",
          "_react=[key = 'developer/javascript-en-doc']",
          // "_react=[key = 'eetann/eetann-portfolio']",
          "input[type=checkbox] ~ span",
        ].join(" >> ")
      )
      .click();
  });

  test.step("check @ content script", async () => {
    // TODO: add, toggleの確認
  });

  await test.step("remove customLink", async () => {
    await page
      .locator(
        [
          "_react=CustomLinkTable",
          "tr:has-text('Test group')",
          "_react=[aria-label = 'Delete customLink']",
        ].join(" >> ")
      )
      .click();
    await expect(page.locator("_react=CustomLinkTable")).not.toHaveText(
      /Test group/
    );
  });

  test.step("check @ content script", async () => {
    // TODO: removeの確認
  });
});
