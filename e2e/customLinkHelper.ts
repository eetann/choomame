import { locator } from "./helper.js";
import { Page } from "@playwright/test";

export async function goOptionsPage(page: Page, extensionId: string) {
  await page.goto(`chrome-extension://${extensionId}/index.html`);
  await page.locator(["_react=App", "text='Custom Link'"].join(" >> ")).click();
}

export async function addCustomLinkItem(page: Page) {
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
  await locator(page, ["_react=CustomLinkItemForm", "text='Save'"]).click();
}
