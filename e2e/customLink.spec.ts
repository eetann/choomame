import { customLinkRestoreJsonSchema } from "../src/features/customLink/customLinkSchema.js";
import { addCustomLinkItem, goOptionsPage } from "./customLinkHelper.js";
import { test, expect } from "./fixtures.js";
import { locator } from "./helper.js";
import fs from "fs";
import JSON5 from "json5";

const filePath = `test-results/choomame-custom-link.json5`;

test("CustomLinks", async ({ page, extensionId }) => {
  await goOptionsPage(page, extensionId);

  await test.step("preparation for export", async () => {
    // add
    await page.getByTestId("open-popover-for-new-item").click();
    await addCustomLinkItem(page);
    // toggle
    await locator(page, [
      "_react=CustomLinkTable",
      "tr:has-text('Homepagehttps://www.typescriptlang.org')",
      "input[type=checkbox] ~ span",
    ]).click();
  });

  await test.step("export customLink", async () => {
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      locator(page, [
        "_react=CustomLinkTab",
        "button:has-text('Export')",
      ]).click(),
    ]);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(err);
      }
    }
    await download.saveAs(filePath);
  });

  await test.step("check `export customLink`", async () => {
    expect(fs.existsSync(filePath)).toBeTruthy();

    const actualFile = fs.readFileSync(filePath);
    const actualJson5 = JSON5.parse(actualFile.toString());
    const result = customLinkRestoreJsonSchema.parse(actualJson5);
    expect(result.id).toBe("user");
    expect(result.name).toBe("user");
    const [actualCustomLink] = result.items.filter(
      (item) => item.name === "eetann GitHub"
    );
    expect(actualCustomLink.id).toMatch(/^user\/.*/);
    expect(actualCustomLink.group).toBe("Test group");
    expect(actualCustomLink.match).toBe(".*");
    expect(actualCustomLink.url).toBe("https://github.com/eetann");
    expect(actualCustomLink.enable).toBe(true);
    const [actualCollection1] = result.collection.filter(
      (collection) =>
        collection.url ===
        "https://raw.githubusercontent.com/eetann/choomame-custom-link-collection/main/src/choomame-e2e.json5"
    );
    expect(actualCollection1.disableIds).toEqual([
      "chroomame-e2e/typescript-homepage",
    ]);
  });

  await goOptionsPage(page, extensionId);

  await test.step("reset customLink", async () => {
    await locator(page, [
      "_react=ResetButton[name = 'Custom Link']",
      "text='Reset'",
    ]).click();
    await page.locator("text='Yes, reset.'").click();
  });

  await test.step("check `reset customLink` @ options", async () => {
    // Collection
    await expect(
      page.locator("_react=CustomLinkCollectionTable")
    ).not.toHaveText(/eetann.json5/);
    // customLink
    for (const url of [
      "https://hub-eetann.vercel.app",
      "https://chrome.google.com/webstore/detail/lecnbgonlcmmpkpnngbofggjiccbnokn",
    ]) {
      await expect(page.locator("_react=CustomLinkTable")).not.toHaveText(
        new RegExp(url)
      );
    }
  });

  await test.step("check `reset customLink` @ content", async () => {
    await page.goto("https://www.google.com/search?q=typescript+record");
    // check that added items have been reset
    await expect(page.locator("#choomameCustomItemLink")).not.toHaveText(
      /Test group/
    );
    // check that toggled items have been reset
    await expect(page.locator("#choomameCustomItemLink")).toHaveText(
      new RegExp("Homepage")
    );
  });

  await goOptionsPage(page, extensionId);

  await test.step("import customLink", async () => {
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      locator(page, [
        "_react=CustomLinkTab",
        "button:has-text('Import')",
      ]).click(),
    ]);
    await fileChooser.setFiles(filePath);
  });

  await test.step("check `import customLink` @ options", async () => {
    // restore user item
    await expect(page.locator("_react=CustomLinkTable")).toHaveText(
      /Test group/
    );
    // restore Collection
    await expect(page.locator("_react=CustomLinkCollectionTable")).toHaveText(
      /choomame-e2e.json5/
    );

    // disable
    await expect(
      locator(page, [
        "_react=CustomLinkTable",
        "tr:has-text('Homepage')",
        "input[type=checkbox] ~ span",
      ])
    ).not.toBeChecked();
  });
});
