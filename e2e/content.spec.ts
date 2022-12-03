import { test, expect } from "./fixtures.ts";

test('example test', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page.locator('body')).toHaveText(/example/);
});

// test('popup page', async ({ page, extensionId }) => {
//   await page.goto(`chrome-extension://${extensionId}/index.html`);
//   await expect(page.locator('body')).toHaveText('Choomame');
// });
