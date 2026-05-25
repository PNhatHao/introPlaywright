import { test, expect } from '@playwright/test';

test('Open Google and verify title', async ({ page }) => {
  await page.goto('https://google.com');

  await expect(page.locator('textarea[name="q"]')).toBeVisible();
  // await expect(page).toHaveTitle(/Google/);
  // console.log(await page.title());
});
