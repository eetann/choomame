import { test, expect } from "./fixtures.js";

test("CustomLink Popup", async ({ page, extensionId, context }) => {
  await page.waitForTimeout(1000);

  await test.step("open tab instead of popup", async () => {
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
  });

  await test.step("enter keyword in tab", async () => {
    await page.getByPlaceholder("Enter keyword...").fill("ts");
  });

  await test.step("check result @ tab", async () => {
    for (const customLink of ["TypeScript", "Homepage", "Reference"]) {
      await expect(page.locator("#choomameCustomItemLink")).toHaveText(
        new RegExp(customLink)
      );
    }
  });

  await test.step("check button @ tab", async () => {
    // open settings
    const [newPage1] = await Promise.all([
      context.waitForEvent("page"),
      page.locator("_react=[aria-label = 'Open Settings']").click(),
    ]);
    expect(newPage1.url()).toBe(`chrome-extension://${extensionId}/index.html`);

    // open tab
    await page.goto(`chrome-extension://${extensionId}/popup.html`);
    const [newPage2] = await Promise.all([
      context.waitForEvent("page"),
      page.locator("_react=[aria-label = 'Open tab instead of popup']").click(),
    ]);
    expect(newPage2.url()).toBe(`chrome-extension://${extensionId}/popup.html`);
  });
});
