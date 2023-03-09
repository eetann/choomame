import { Page } from "@playwright/test";

export function locator(page: Page, locators: string[]) {
  return page.locator(locators.join(" >> "));
}
