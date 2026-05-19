import { test, expect } from '@playwright/test';

test('Login success', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');

  // Tìm input liên kết với label “Username” và "Password".
  await page.getByLabel('Username').fill('tomsmith');
  await page.getByLabel('Password').fill('SuperSecretPassword!');

  // Tìm button có accessible name là Login.
  await page.getByRole('button', {name: 'Login'}).click();

  // Verify đã redirect đúng.
  await expect(page).toHaveURL(/secure/);

  await expect(
    page.locator('#flash')
  ).toContainText('You logged into a secure area!');

});

// npx playwright test tests/1flaky.spec.ts --debug --project=chromium
// npx playwright test Demoscript/LoginTest.spec.ts --repeat-each=10




// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });