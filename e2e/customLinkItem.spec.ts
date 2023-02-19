import { addCustomLinkItem, goOptionsPage } from "./customLinkHelper.js";
import { test, expect } from "./fixtures.js";
import { locator } from "./helper.js";

test("CustomLink Item", async ({ page, extensionId }) => {
  await page.goto("https://www.google.com/search?q=javascript+foreach");

  await test.step("check `URL conversion` @ content", async () => {
    // check googleWithURL
    await expect(
      locator(page, ["#choomameCustomItemLink", "a:has(svg)"])
    ).toHaveAttribute(
      "href",
      "https://www.google.com/search?q=site:developer.mozilla.org/en-US/docs/Web/JavaScript foreach"
    );
    // check search in the site
    await expect(
      locator(page, [
        "#choomameCustomItemLink",
        "a:has-text('Search in Reference')",
      ])
    ).toHaveAttribute(
      "href",
      "https://developer.mozilla.org/en-US/search?q=foreach"
    );
  });

  await goOptionsPage(page, extensionId);

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
      locator(page, ["_react=CustomLinkItemForm", "text='Save'"])
    ).toBeDisabled();
    await expect(page.locator("div:has(> #urlInput) + div")).toHaveText(
      /URL is invalid./
    );
  });

  await test.step("add CustomLink item", async () => {
    await addCustomLinkItem(page);
  });

  await test.step("check `add CustomLink item` @ form", async () => {
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

  await test.step("toggle customLink item", async () => {
    await locator(page, [
      "_react=CustomLinkTable",
      "tr:has-text('Homepagehttps://www.typescriptlang.org')",
      "input[type=checkbox] ~ span",
    ]).click();
  });

  await page.goto("https://www.google.com/search?q=typescript+record");

  await test.step("check `add and toggle customLink item` @ content", async () => {
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

  await goOptionsPage(page, extensionId);

  await test.step("remove customLink item", async () => {
    await locator(page, [
      "_react=CustomLinkTable",
      "tr:has-text('Test group')",
      "_react=[aria-label = 'Delete customLink']",
    ]).click();
    await expect(page.locator("_react=CustomLinkTable")).not.toHaveText(
      /Test group/
    );
  });

  await page.goto("https://www.google.com/search?q=typescript+record");

  await test.step("check `remove customLink item` @ content", async () => {
    await expect(page.locator("#choomameCustomItemLink")).not.toHaveText(
      /Test group/
    );
  });
});
