import { customLinkRestoreJsonSchema } from "../src/features/customLink/customLinkSchema.js";
import { test, expect } from "./fixtures.js";
import fs from "fs";
import JSON5 from "json5";

const filePath = `test-results/choomame-custom-link.json5`;

test("CustomLink Item", async ({ page, extensionId }) => {
  await page.goto("https://www.google.com/search?q=javascript+foreach");

  await test.step("check URL", async () => {
    // check googleWithURL
    await expect(
      page.locator(["#choomameCustomItemLink", "a:has(svg)"].join(" >> "))
    ).toHaveAttribute(
      "href",
      "https://www.google.com/search?q=site:developer.mozilla.org/en-US/docs/Web/JavaScript foreach"
    );
    // check search in the site
    await expect(
      page.locator(
        ["#choomameCustomItemLink", "a:has-text('Search in Reference')"].join(
          " >> "
        )
      )
    ).toHaveAttribute(
      "href",
      "https://developer.mozilla.org/en-US/search?q=foreach"
    );
  });

  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.locator(["_react=App", "text='Custom Link'"].join(" >> ")).click();

  await test.step("error handling: zod schema", async () => {
    await page.getByTestId("open-popover-for-new-item").click();
    await page
      .locator("_react=CustomLinkItemForm")
      .getByLabel("Group name")
      .fill("a");
    await page
      .locator("_react=CustomLinkItemForm")
      .getByLabel("Match")
      .fill("a");
    await page
      .locator("_react=CustomLinkItemForm")
      .getByLabel("Link name")
      .fill("a");
    await page.locator("_react=CustomLinkItemForm").getByLabel("URL").fill("a");
    await expect(
      page.locator(["_react=CustomLinkItemForm", "text='Save'"].join(" >> "))
    ).toBeDisabled();
    await expect(page.locator("div:has(> #urlInput) + div")).toHaveText(
      /URL is invalid./
    );
  });

  await test.step("add new CustomLink", async () => {
    await page
      .locator("_react=CustomLinkItemForm")
      .getByLabel("Group name")
      .fill("Test group");
    await page
      .locator("_react=CustomLinkItemForm")
      .getByLabel("Match")
      .fill(".*");
    await page
      .locator("_react=CustomLinkItemForm")
      .getByLabel("Link name")
      .fill("eetann GitHub");
    await page
      .locator("_react=CustomLinkItemForm")
      .getByLabel("URL")
      .fill("https://github.com/eetann");
    await page
      .locator(["_react=CustomLinkItemForm", "text='Save'"].join(" >> "))
      .click();
  });

  await test.step("check @ form", async () => {
    await expect(
      page.locator("_react=CustomLinkItemForm").getByLabel("Group name")
    ).toHaveValue("Test group");
    await expect(
      page.locator("_react=CustomLinkItemForm").getByLabel("Match")
    ).toHaveValue(".*");
    await expect(
      page.locator("_react=CustomLinkItemForm").getByLabel("Link name")
    ).toHaveValue("");
    await expect(
      page.locator("_react=CustomLinkItemForm").getByLabel("URL")
    ).toHaveValue("");
  });

  await test.step("toggle customLink", async () => {
    await page
      .locator(
        [
          "_react=CustomLinkTable",
          "tr:has-text('Homepagehttps://www.typescriptlang.org')",
          "input[type=checkbox] ~ span",
        ].join(" >> ")
      )
      .click();
  });

  await page.goto("https://www.google.com/search?q=typescript+record");

  await test.step("check @ content script", async () => {
    // check add
    await expect(page.locator("#choomameCustomItemLink")).toHaveText(
      /Test group/
    );
    await expect(page.locator("#choomameCustomItemLink")).toHaveText(
      new RegExp("eetann GitHub")
    );
    // check toggle
    await expect(page.locator("#choomameCustomItemLink")).not.toHaveText(
      new RegExp("Homepage")
    );
  });

  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.locator(["_react=App", "text='Custom Link'"].join(" >> ")).click();

  await test.step("export customLink", async () => {
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page
        .locator(
          ["_react=CustomLinkTab", "button:has-text('Export')"].join(" >> ")
        )
        .click(),
    ]);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(err);
      }
    }
    await download.saveAs(filePath);
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

  await test.step("check @ content script", async () => {
    await page.goto("https://www.google.com/search?q=typescript+record");
    await expect(page.locator("#choomameCustomItemLink")).not.toHaveText(
      /Test group/
    );
  });

  await test.step("add new CustomLink for reset", async () => {
    await page.goto(`chrome-extension://${extensionId}/index.html`);
    await page
      .locator(["_react=App", "text='Custom Link'"].join(" >> "))
      .click();

    await page.getByTestId("open-popover-for-new-item").click();
    await page
      .locator("_react=CustomLinkItemForm")
      .getByLabel("Group name")
      .fill("Test group");
    await page
      .locator("_react=CustomLinkItemForm")
      .getByLabel("Match")
      .fill(".*");
    await page
      .locator("_react=CustomLinkItemForm")
      .getByLabel("Link name")
      .fill("eetann GitHub");
    await page
      .locator("_react=CustomLinkItemForm")
      .getByLabel("URL")
      .fill("https://github.com/eetann");
    await page
      .locator(["_react=CustomLinkItemForm", "text='Save'"].join(" >> "))
      .click();
  });

  await test.step("reset customLink", async () => {
    await page
      .locator(
        ["_react=ResetButton[name = 'Custom Link']", "text='Reset'"].join(
          " >> "
        )
      )
      .click();
    await page.locator("text='Yes, reset.'").click();
  });

  await test.step("check @ option page", async () => {
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

  await test.step("check @ content script", async () => {
    await page.goto("https://www.google.com/search?q=typescript+record");
    // check for add
    await expect(page.locator("#choomameCustomItemLink")).not.toHaveText(
      /Test group/
    );
    // check for toggle
    await expect(page.locator("#choomameCustomItemLink")).toHaveText(
      new RegExp("Homepage")
    );
  });

  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.locator(["_react=App", "text='Custom Link'"].join(" >> ")).click();

  await test.step("import customLink", async () => {
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      page
        .locator(
          ["_react=CustomLinkTab", "button:has-text('Import')"].join(" >> ")
        )
        .click(),
    ]);
    await fileChooser.setFiles(filePath);

    await test.step("check @ option page", async () => {
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
        page.locator(
          [
            "_react=CustomLinkTable",
            "tr:has-text('Homepage')",
            "input[type=checkbox] ~ span",
          ].join(" >> ")
        )
      ).not.toBeChecked();
    });
  });
});
