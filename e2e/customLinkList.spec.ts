import { test, expect } from "./fixtures.js";
import { readFileSync } from "fs";

test.beforeAll(async ({ context }) => {
  await context.route(
    "https://raw.githubusercontent.com/eetann/choomame-custom-link-list/main/src/eetann.json5",
    async (route) => {
      const mockRawData = readFileSync("./e2e/eetann.json5");
      await route.fulfill({
        body: mockRawData,
      });
    }
  );
});

test("CustomLink List", async ({ page, extensionId }) => {
  await page.goto("https://www.google.com/search?q=typescript+record");

  await test.step("onInstalled", async () => {
    await expect(page.locator("#choomameCustomLinksLink")).toHaveText(
      new RegExp("Homepage")
    );
  });

  await test.step("error handling: zod schema", async () => {
    await page.goto(`chrome-extension://${extensionId}/index.html`);
    await page
      .locator(["_react=App", "text='Custom Link'"].join(" >> "))
      .click();

    await page.getByTestId("open-popover-for-new-list").click();
    await page.locator("#customLinkListURL").fill("aaaa");
    await page
      .locator(
        ["_react=CustomLinkListForm", "button:has-text('Save')"].join(" >> ")
      )
      .click();
    await expect(page.locator("#customLinkListURL ~ div")).toHaveText(
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
      .locator(
        ["_react=CustomLinkListForm", "button:has-text('Save')"].join(" >> ")
      )
      .click();
    await expect(page.locator("#customLinkListURL ~ div")).toHaveText(
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
      .locator(
        ["_react=CustomLinkListForm", "button:has-text('Save')"].join(" >> ")
      )
      .click();
    await expect(page.locator("_react=CustomLinkListTable")).toHaveText(
      /eetann-E2E/
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
    await page.goto("https://www.google.com/search?q=eetann");
    await expect(page.locator("#choomameCustomLinksLink")).toHaveText(/eetann/);
    for (const customLink of ["Portfolio", "GitHub"]) {
      await expect(page.locator("#choomameCustomLinksLink")).toHaveText(
        new RegExp(customLink)
      );
    }
  });

  await test.step("remove list", async () => {
    await page.goto(`chrome-extension://${extensionId}/index.html`);
    await page
      .locator(["_react=App", "text='Custom Link'"].join(" >> "))
      .click();

    await page
      .locator(
        [
          "_react=CustomLinkListTable",
          "tr:has-text('eetann.json5')",
          "_react=[aria-label = 'Delete custom link list']",
        ].join(" >> ")
      )
      .click();
    await expect(page.locator("_react=CustomLinkListTable")).not.toHaveText(
      /eetann.json5/
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
    await page.goto("https://www.google.com/search?q=eetann");
    await expect(page.locator("#choomameCustomLinksLink")).not.toHaveText(
      /eetann/
    );
    for (const customLink of ["Portfolio", "GitHub"]) {
      await expect(page.locator("#choomameCustomLinksLink")).not.toHaveText(
        new RegExp(customLink)
      );
    }
  });
});
