import {
  test,
  expect
} from '@playwright/test';

test.describe(  'Unauthorized Access',  () => {

  test(
    'guest redirected to login',    async ({ page }) => {

      await page.goto('/secure');
      await expect(page).toHaveURL(/login/);
    });
});