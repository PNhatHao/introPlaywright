import { test, expect } from '@playwright/test';

test('Login success', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');

  // Tìm input liên kết với label “Username” và "Password".
  await page.getByLabel('Username').fill('tomsmith');
  await page.getByLabel('Password').fill('SuperSecretPassword!');

  // Tìm button có accessible name là Login.
  await page.getByRole('button', {name: 'Login'}).click();

  await expect(page).toHaveURL(/secure/);
  //
  await expect(
    page.getByRole('heading', {
      name: 'Secure Area',  //   name: /^Secure Area$/
      exact: true
    })
  ).toBeVisible();

  await expect(page.locator('#flash'))
  .toContainText('You logged into a secure area!');

    await expect(
    page.getByRole('heading', {
      level: 2,
      name: 'Secure Area'
    })
  ).toBeVisible();
  //-----------------

});