import { goOptionsPage } from "./customLinkHelper.js";
import { test, expect } from "./fixtures.js";
import { locator } from "./helper.js";
import { Page } from "@playwright/test";
import { readFileSync } from "fs";

const MOCK_JSON5_URL =
  "https://raw.githubusercontent.com/eetann/choomame-custom-link-collection/main/src/eetann.json5";

async function testCollectionUpdate(page: Page) {
  await test.step("check `collection update` @ options", async () => {
    // check whether Collection was updated
    await expect(
      page.locator("_react=CustomLinkCollectionTable")
    ).not.toHaveText(/eetann-E2E-before/);
    await expect(page.locator("_react=CustomLinkCollectionTable")).toHaveText(
      /eetann-E2E-after/
    );

    // check whether Item was updated
    // does not exist beforeOnly
    await expect(page.locator("_react=CustomLinkTable")).not.toHaveText(
      new RegExp("https://hub-eetann.vercel.app")
    );
    // exist
    for (const includeText of [
      "https://note.com/hideharu092", // afterOnly
      "https://zenn.dev/eetann", // same
      "ツイッター", // update
    ]) {
      await expect(page.locator("_react=CustomLinkTable")).toHaveText(
        new RegExp(includeText)
      );
    }

    // check whether `enable` is still false
    await expect(
      locator(page, [
        "_react=CustomLinkTable",
        "tr:has-text('eetann|choomame|えーたん')",
        "input[type=checkbox] ~ span",
      ])
    ).not.toBeChecked();
  });
}

test.beforeAll(async ({ context }) => {
  await context.route(MOCK_JSON5_URL, async (route) => {
    const mockRawData = readFileSync("./e2e/eetann-before-update.json5");
    await route.fulfill({
      body: mockRawData,
    });
  });
});

test("CustomLink Collection", async ({ page, extensionId, context }) => {
  await page.waitForTimeout(1000);
  await page.goto("https://www.google.com/search?q=typescript+record");

  await test.step("onInstalled", async () => {
    await expect(page.locator("#choomameCustomItemLink")).toHaveText(
      new RegExp("Homepage")
    );
  });

  await goOptionsPage(page, extensionId);

  await test.step("error handling: zod schema", async () => {
    await page.getByTestId("open-popover-for-new-collection").click();
    await page.locator("#customLinkCollectionURL").fill("aaaa");
    await locator(page, [
      "_react=CustomLinkCollectionForm",
      "button:has-text('Save')",
    ]).click();
    await expect(page.locator("#customLinkCollectionURL ~ div")).toHaveText(
      /Collection URL is invalid/
    );
  });

  await test.step("error handling: invalid JSON5 format", async () => {
    await page
      .locator("#customLinkCollectionURL")
      .fill(
        "https://raw.githubusercontent.com/eetann/choomame-custom-link-collection/main/src/developer.json5555"
      );
    await locator(page, [
      "_react=CustomLinkCollectionForm",
      "button:has-text('Save')",
    ]).click();
    await expect(page.locator("#customLinkCollectionURL ~ div")).toHaveText(
      /The JSON5 in this URL is an invalid format/
    );
  });

  await test.step("add Collection", async () => {
    await page.locator("#customLinkCollectionURL").fill(MOCK_JSON5_URL);
    await locator(page, [
      "_react=CustomLinkCollectionForm",
      "button:has-text('Save')",
    ]).click();
    await expect(page.locator("_react=CustomLinkCollectionTable")).toHaveText(
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

  await test.step("check `add Collection` @ content", async () => {
    await page.goto("https://www.google.com/search?q=eetann");
    await expect(page.locator("#choomameCustomItemLink")).toHaveText(/eetann/);
    for (const customLink of ["Portfolio", "GitHub"]) {
      await expect(page.locator("#choomameCustomItemLink")).toHaveText(
        new RegExp(customLink)
      );
    }
  });

  await goOptionsPage(page, extensionId);

  await test.step("update Collection", async () => {
    // to check `enable` status
    await locator(page, [
      "_react=CustomLinkTable",
      "tr:has-text('eetann|choomame|えーたん')",
      "input[type=checkbox] ~ span",
    ]).click();
    await page.route(MOCK_JSON5_URL, async (route) => {
      const mockRawData = readFileSync("./e2e/eetann-after-update.json5");
      await route.fulfill({
        body: mockRawData,
      });
    });
    await page.locator("button:has-text('Manual Update')").click();
    await expect(
      page.locator("button:has-text('Manual Updating')")
    ).toBeVisible();
  });

  await testCollectionUpdate(page);

  await goOptionsPage(page, extensionId);

  await test.step("remove Collection", async () => {
    await locator(page, [
      "_react=CustomLinkCollectionTable",
      "tr:has-text('eetann.json5')",
      "_react=[aria-label = 'Delete custom link collection']",
    ]).click();
    await expect(
      page.locator("_react=CustomLinkCollectionTable")
    ).not.toHaveText(/eetann.json5/);
    for (const url of [
      "https://hub-eetann.vercel.app",
      "https://chrome.google.com/webstore/detail/lecnbgonlcmmpkpnngbofggjiccbnokn",
    ]) {
      await expect(page.locator("_react=CustomLinkTable")).not.toHaveText(
        new RegExp(url)
      );
    }
  });

  await test.step("check `remove Collection` @ content", async () => {
    await page.goto("https://www.google.com/search?q=eetann");
    await expect(page.locator("#choomameCustomItemLink")).not.toHaveText(
      /eetann/
    );
    for (const customLink of ["Portfolio", "GitHub"]) {
      await expect(page.locator("#choomameCustomItemLink")).not.toHaveText(
        new RegExp(customLink)
      );
    }
  });

  await goOptionsPage(page, extensionId);

  await test.step("Auto update", async () => {
    // add
    await page.getByTestId("open-popover-for-new-collection").click();
    await page.locator("#customLinkCollectionURL").fill(MOCK_JSON5_URL);
    await locator(page, [
      "_react=CustomLinkCollectionForm",
      "button:has-text('Save')",
    ]).click();
    await locator(page, [
      "_react=CustomLinkTable",
      "tr:has-text('eetann|choomame|えーたん')",
      "input[type=checkbox] ~ span",
    ]).click();

    // mock
    await page.route(MOCK_JSON5_URL, async (route) => {
      const mockRawData = readFileSync("./e2e/eetann-after-update.json5");
      await route.fulfill({
        body: mockRawData,
      });
    });

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
    await testCollectionUpdate(page);
  });
});
