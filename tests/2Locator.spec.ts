import { test, expect } from '@playwright/test';

test('locator strategy comparison', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');

  const username = page.locator('#username');

  const password = page.locator('#password');

  const loginButton = page.getByRole('button', {
    name: 'Login'
  });

  await username.fill('tomsmith');
  await password.fill('SuperSecretPassword!');

  await loginButton.click();

  await expect(page).toHaveURL(/secure/);
});