import { test, expect } from '@playwright/test';

import { mockLoginApi } from '@helpers/api-helper';

test.describe(
  'API Mocking Regression', () => {
  test( 'mock login API response', async ({ page }) => {

      await mockLoginApi(page);

      await page.goto('/login');

      await page.getByLabel('Username')
        .fill('tomsmith');

      await page.getByLabel('Password')
        .fill('SuperSecretPassword!');

      await page.getByRole('button', {
        name: 'Login'
      }).click();

      await expect(page)
        .toHaveURL(/authenticate/); //authenticate  secure

    });

});