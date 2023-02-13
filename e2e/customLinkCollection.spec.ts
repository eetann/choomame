import { test, expect } from "./fixtures.js";
import { Page } from "@playwright/test";
import { readFileSync } from "fs";

async function testCollectionUpdate(page: Page) {
  await test.step("check @ option page", async () => {
    // Collection
    await expect(
      page.locator("_react=CustomLinkCollectionTable")
    ).not.toHaveText(/eetann-E2E-before/);
    await expect(page.locator("_react=CustomLinkCollectionTable")).toHaveText(
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
    "https://raw.githubusercontent.com/eetann/choomame-custom-link-collection/main/src/eetann.json5",
    async (route) => {
      const mockRawData = readFileSync("./e2e/eetann-before-update.json5");
      await route.fulfill({
        body: mockRawData,
      });
    }
  );
});

test("CustomLink Collection", async ({ page, extensionId, context }) => {
  await page.waitForTimeout(3000);
  await page.goto("https://www.google.com/search?q=typescript+record");

  await test.step("onInstalled", async () => {
    await expect(page.locator("#choomameCustomItemLink")).toHaveText(
      new RegExp("Homepage")
    );
  });

  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.locator(["_react=App", "text='Custom Link'"].join(" >> ")).click();

  await test.step("error handling: zod schema", async () => {
    await page.getByTestId("open-popover-for-new-collection").click();
    await page.locator("#customLinkCollectionURL").fill("aaaa");
    await page
      .locator(
        ["_react=CustomLinkCollectionForm", "button:has-text('Save')"].join(
          " >> "
        )
      )
      .click();
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
    await page
      .locator(
        ["_react=CustomLinkCollectionForm", "button:has-text('Save')"].join(
          " >> "
        )
      )
      .click();
    await expect(page.locator("#customLinkCollectionURL ~ div")).toHaveText(
      /The JSON5 in this URL is an invalid format/
    );
  });

  await test.step("add Collection", async () => {
    await page
      .locator("#customLinkCollectionURL")
      .fill(
        "https://raw.githubusercontent.com/eetann/choomame-custom-link-collection/main/src/eetann.json5"
      );
    await page
      .locator(
        ["_react=CustomLinkCollectionForm", "button:has-text('Save')"].join(
          " >> "
        )
      )
      .click();
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

  await test.step("check @ content script", async () => {
    await page.goto("https://www.google.com/search?q=eetann");
    await expect(page.locator("#choomameCustomItemLink")).toHaveText(/eetann/);
    for (const customLink of ["Portfolio", "GitHub"]) {
      await expect(page.locator("#choomameCustomItemLink")).toHaveText(
        new RegExp(customLink)
      );
    }
  });

  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.locator(["_react=App", "text='Custom Link'"].join(" >> ")).click();

  await test.step("update Collection", async () => {
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
      "https://raw.githubusercontent.com/eetann/choomame-custom-link-collection/main/src/eetann.json5",
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

  await testCollectionUpdate(page);

  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.locator(["_react=App", "text='Custom Link'"].join(" >> ")).click();

  await test.step("remove Collection", async () => {
    await page
      .locator(
        [
          "_react=CustomLinkCollectionTable",
          "tr:has-text('eetann.json5')",
          "_react=[aria-label = 'Delete custom link collection']",
        ].join(" >> ")
      )
      .click();
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

  await test.step("check @ content script", async () => {
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

  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.locator(["_react=App", "text='Custom Link'"].join(" >> ")).click();

  await test.step("Auto update", async () => {
    // add
    await page.getByTestId("open-popover-for-new-collection").click();
    await page
      .locator("#customLinkCollectionURL")
      .fill(
        "https://raw.githubusercontent.com/eetann/choomame-custom-link-collection/main/src/eetann.json5"
      );
    await page
      .locator(
        ["_react=CustomLinkCollectionForm", "button:has-text('Save')"].join(
          " >> "
        )
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
      "https://raw.githubusercontent.com/eetann/choomame-custom-link-collection/main/src/eetann.json5",
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
    await testCollectionUpdate(page);
  });
});
