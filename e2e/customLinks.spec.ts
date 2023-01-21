import { test, expect } from "./fixtures.js";

test("CustomLinks", async ({ page, extensionId }) => {
  await page.goto("https://www.google.com/search?q=javascript+foreach");

  await test.step("check URL", async () => {
    // check googleWithURL
    await expect(
      page.locator(["#choomameCustomLinksLink", "a:has(svg)"].join(" >> "))
    ).toHaveAttribute(
      "href",
      "https://www.google.com/search?q=site:developer.mozilla.org/en-US/docs/Web/JavaScript foreach"
    );
    // check search in the site
    await expect(
      page.locator(
        ["#choomameCustomLinksLink", "a:has-text('Search in Reference')"].join(
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
    await page.getByTestId("open-popover-for-new-link").click();
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
      page.locator(["_react=CustomLinkForm", "text='Save'"].join(" >> "))
    ).toBeDisabled();
    await expect(page.locator("div:has(> #urlInput) + div")).toHaveText(
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
      .locator(["_react=CustomLinkForm", "text='Save'"].join(" >> "))
      .click();
  });

  await test.step("check @ form", async () => {
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
          "tr:has-text('Homepagehttps://www.typescriptlang.org')",
          "input[type=checkbox] ~ span",
        ].join(" >> ")
      )
      .click();
  });

  await page.goto("https://www.google.com/search?q=typescript+record");

  await test.step("check @ content script", async () => {
    // check add
    await expect(page.locator("#choomameCustomLinksLink")).toHaveText(
      /Test group/
    );
    await expect(page.locator("#choomameCustomLinksLink")).toHaveText(
      new RegExp("eetann GitHub")
    );
    // check toggle
    await expect(page.locator("#choomameCustomLinksLink")).not.toHaveText(
      new RegExp("Homepage")
    );
  });

  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.locator(["_react=App", "text='Custom Link'"].join(" >> ")).click();

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
    await expect(page.locator("#choomameCustomLinksLink")).not.toHaveText(
      /Test group/
    );
  });

  await test.step("add new CustomLink for reset", async () => {
    await page.goto(`chrome-extension://${extensionId}/index.html`);
    await page
      .locator(["_react=App", "text='Custom Link'"].join(" >> "))
      .click();

    await page.getByTestId("open-popover-for-new-link").click();
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
      .locator(["_react=CustomLinkForm", "text='Save'"].join(" >> "))
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
    // list
    await expect(page.locator("_react=CustomLinkListTable")).not.toHaveText(
      /eetann.json5/
    );
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
    await expect(page.locator("#choomameCustomLinksLink")).not.toHaveText(
      /Test group/
    );
    // check for toggle
    await expect(page.locator("#choomameCustomLinksLink")).toHaveText(
      new RegExp("Homepage")
    );
  });
});
