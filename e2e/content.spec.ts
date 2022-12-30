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
  await page.locator(["_react=App", "text='Language'"].join(" >> ")).click();
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

  // remove language
  await page
    .locator(
      [
        "_react=LanguagesTable",
        "tr:has-text('Japanese')",
        "_react=[aria-label = 'Delete language']",
      ].join(" >> ")
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
  await page.locator(["_react=App", "text='Language'"].join(" >> ")).click();
  await page
    .locator(["_react=LanguagesReset", "text='Reset'"].join(" >> "))
    .click();
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
  await page.locator(["_react=App", "text='Time'"].join(" >> ")).click();
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

  // remove time
  await page
    .locator(
      [
        "_react=TimesTable",
        "tr:has-text('6 month')",
        "_react=[aria-label = 'Delete time']",
      ].join(" >> ")
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
  await page.locator(["_react=App", "text='Time'"].join(" >> ")).click();
  await page
    .locator(["_react=TimesReset", "text='Reset'"].join(" >> "))
    .click();
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

test("CustomLink list test", async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.locator(["_react=App", "text='Custom Link'"].join(" >> ")).click();

  // error handling: zod schema
  await page.locator("#customLinkListURL").fill("aaaa");
  await page
    .locator(["_react=CustomLinkListForm", "text='Add'"].join(" >> "))
    .click();
  await expect(page.locator("_react=CustomLinkListForm")).toHaveText(
    /list's URL is invalid/
  );

  // error handling: invalid JSON5 format
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

  // add
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
  // TODO: customLinkがTable・content scriptで表示されるか確認

  // remove
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
  // TODO: customLinkがTable・content scriptで表示されないことを確認

  // toggle
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
  // TODO: customLinkがcontent scriptで表示されないことを確認
});

test("CustomLinks test", async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.locator(["_react=App", "text='Custom Link'"].join(" >> ")).click();

  // error handling: zod schema
  await page
    .locator("_react=CustomLinkForm")
    .getByLabel("Group name")
    .fill("a");
  await page.locator("_react=CustomLinkForm").getByLabel("Match").fill("a");
  await page.locator("_react=CustomLinkForm").getByLabel("Link name").fill("a");
  await page.locator("_react=CustomLinkForm").getByLabel("URL").fill("a");
  await expect(
    page.locator(["_react=CustomLinkForm", "text='Add'"].join(" >> "))
  ).toBeDisabled();
  await expect(page.locator("_react=CustomLinkForm")).toHaveText(
    /URL is invalid./
  );

  // add new CustomLink
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
  // check
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
  // TODO: customLinkがcontent scriptで表示されるか確認

  // remove
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
  // TODO: customLinkがcontent scriptで表示されないこと確認
});
