import { test, expect } from "./fixtures.js";
import { Page } from "@playwright/test";
import { readFileSync } from "fs";

async function testListUpdate(page: Page) {
  await test.step("check @ option page", async () => {
    // list
    await expect(page.locator("_react=CustomLinkListTable")).not.toHaveText(
      /eetann-E2E-before/
    );
    await expect(page.locator("_react=CustomLinkListTable")).toHaveText(
      /eetann-E2E-after/
    );
    // customLink
    // beforeOnly
    await expect(page.locator("_react=CustomLinkTable")).not.toHaveText(
      new RegExp("https://hub-eetann.vercel.app")
    );
    for (const includeText of [
      "https://note.com/hideharu092", // afterOnly
      "https://zenn.dev/eetann", //same
      "ツイッター", // update
    ]) {
      await expect(page.locator("_react=CustomLinkTable")).toHaveText(
        new RegExp(includeText)
      );
    }

    // check whether `enable` is still false
    await expect(
      page.locator(
        [
          "_react=CustomLinkTable",
          "tr:has-text('eetann|choomame|えーたん')",
          "input[type=checkbox] ~ span",
        ].join(" >> ")
      )
    ).not.toBeChecked();
  });
}

test.beforeAll(async ({ context }) => {
  await context.route(
    "https://raw.githubusercontent.com/eetann/choomame-custom-link-list/main/src/eetann.json5",
    async (route) => {
      const mockRawData = readFileSync("./e2e/eetann-before-update.json5");
      await route.fulfill({
        body: mockRawData,
      });
    }
  );
});

test("CustomLink List", async ({ page, extensionId, context }) => {
  await page.goto("https://www.google.com/search?q=typescript+record");

  await test.step("onInstalled", async () => {
    await expect(page.locator("#choomameCustomLinksLink")).toHaveText(
      new RegExp("Homepage")
    );
  });

  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.locator(["_react=App", "text='Custom Link'"].join(" >> ")).click();

  await test.step("error handling: zod schema", async () => {
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
      /eetann-E2E-before/
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

  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.locator(["_react=App", "text='Custom Link'"].join(" >> ")).click();

  await test.step("update list", async () => {
    // to check `enable` status
    await page
      .locator(
        [
          "_react=CustomLinkTable",
          "tr:has-text('eetann|choomame|えーたん')",
          "input[type=checkbox] ~ span",
        ].join(" >> ")
      )
      .click();
    await page.route(
      "https://raw.githubusercontent.com/eetann/choomame-custom-link-list/main/src/eetann.json5",
      async (route) => {
        const mockRawData = readFileSync("./e2e/eetann-after-update.json5");
        await route.fulfill({
          body: mockRawData,
        });
      }
    );
    await page.locator("button:has-text('Manual Update')").click();
    await expect(
      page.locator("button:has-text('Manual Updating')")
    ).toBeVisible();
  });

  await testListUpdate(page);

  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.locator(["_react=App", "text='Custom Link'"].join(" >> ")).click();

  await test.step("remove list", async () => {
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

  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.locator(["_react=App", "text='Custom Link'"].join(" >> ")).click();

  await test.step("Auto update", async () => {
    // add
    await page.getByTestId("open-popover-for-new-list").click();
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
    await page
      .locator(
        [
          "_react=CustomLinkTable",
          "tr:has-text('eetann|choomame|えーたん')",
          "input[type=checkbox] ~ span",
        ].join(" >> ")
      )
      .click();

    // mock
    await page.route(
      "https://raw.githubusercontent.com/eetann/choomame-custom-link-list/main/src/eetann.json5",
      async (route) => {
        const mockRawData = readFileSync("./e2e/eetann-after-update.json5");
        await route.fulfill({
          body: mockRawData,
        });
      }
    );

    // background updating
    let [background] = context.serviceWorkers();
    if (!background) background = await context.waitForEvent("serviceworker");

    background.evaluate(() => {
      chrome.alarms.create("ChoomameCustomLinkUpdate", {
        when: Date.now() + 100,
      });
    });

    // check
    await expect(
      page.locator("button:has-text('Background Updating')")
    ).toBeVisible();
    await testListUpdate(page);
  });
});
