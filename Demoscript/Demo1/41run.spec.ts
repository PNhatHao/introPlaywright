import { test, expect } from '@playwright/test';

const BASE_URL = 'https://the-internet.herokuapp.com';

test.describe('Herokuapp Production-like Suite', () => {

  // ========================================
  // GLOBAL NETWORK DEBUGGING
  // ========================================
  test.beforeEach(async ({ page }) => {

    // Request logging
    page.on('request', request => {
      console.log('➡️ REQUEST:', request.method(), request.url());
    });

    // Response logging
    page.on('response', response => {
      console.log('⬅️ RESPONSE:', response.status(), response.url());
    });

  });

  // ========================================
  // TEST 1 — LOGIN SUCCESS FLOW
  // ========================================
  test('login success flow (state-driven)', async ({ page }) => {

    await page.goto(`${BASE_URL}/login`);

    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').fill('SuperSecretPassword!');

    await page.getByRole('button', {
      name: 'Login'
    }).click();

    // ✅ ASSERT APPLICATION STATE
    await expect(page).toHaveURL(/secure/);

    // ✅ ASSERT SUCCESS MESSAGE
    await expect(page.locator('#flash'))
      .toContainText('You logged into a secure area!');

    // ✅ STRICT + STABLE LOCATOR
    await expect(
      page.getByRole('heading', {
        level: 2,
        name: 'Secure Area'
      })
    ).toBeVisible();

  });

  // ========================================
  // TEST 2 — INVALID LOGIN
  // ========================================
  test('login failure shows error', async ({ page }) => {

    await page.goto(`${BASE_URL}/login`);

    await page.getByLabel('Username').fill('wrong-user');
    await page.getByLabel('Password').fill('wrong-password');

    await page.getByRole('button', {
      name: 'Login'
    }).click();

    await expect(page.locator('#flash'))
      .toContainText('Your username is invalid!');

  });

  // ========================================
  // TEST 3 — DYNAMIC LOADING
  // ========================================
  test('dynamic loading without flaky timeout', async ({ page }) => {

    await page.goto(`${BASE_URL}/dynamic_loading/2`);

    const startButton = page.getByRole('button', {
      name: 'Start'
    });

    await expect(startButton).toBeVisible();

    await startButton.click();

    // ❌ BAD
    // await page.waitForTimeout(5000);

    // ✅ GOOD
    await expect(
      page.locator('#finish')
    ).toContainText('Hello World!', {
      timeout: 10000
    });

  });

  // ========================================
  // TEST 4 — FILE UPLOAD
  // ========================================
  test('file upload flow stable assertion', async ({ page }) => {

    await page.goto(`${BASE_URL}/upload`);

    await page.setInputFiles(
      '#file-upload',
      'C:/Users/ASUS/Pictures/2b56590a-7847-4616-a42e-85243a5b59e8.png'
    );

    await page.getByRole('button', {
      name: 'Upload'
    }).click();

    await expect(page.locator('h3'))
      .toHaveText('File Uploaded!');

  });

  // ========================================
  // TEST 5 — AUTHENTICATED SESSION
  // ========================================
  test('authenticated user can access secure area', async ({ page }) => {

    // ====================================
    // LOGIN
    // ====================================
    await page.goto(`${BASE_URL}/login`);

    await page.getByLabel('Username')
      .fill('tomsmith');

    await page.getByLabel('Password')
      .fill('SuperSecretPassword!');

    await page.getByRole('button', {
      name: 'Login'
    }).click();

    // ====================================
    // ASSERT AUTH STATE
    // ====================================
    await expect(page).toHaveURL(/secure/);

    // ====================================
    // ASSERT UI
    // ====================================
    await expect(
      page.getByRole('heading', {
        level: 2,
        name: 'Secure Area'
      })
    ).toBeVisible();

    await expect(page.locator('#flash'))
      .toContainText('You logged into a secure area!');

  });

  // ========================================
  // TEST 6 — RACE CONDITION SAFE TEST
  // ========================================
  test('race condition safe assertion', async ({ page }) => {

    await page.goto(`${BASE_URL}/dynamic_loading/1`);

    await page.getByRole('button', {
      name: 'Start'
    }).click();

    // ❌ BAD
    // await page.waitForTimeout(3000);

    // ✅ GOOD
    await expect(
      page.locator('#finish')
    ).toContainText('Hello World!', {
      timeout: 10000
    });

  });

  // ========================================
  // TEST 7 — MOCK API RESPONSE
  // ========================================
  test('mocked login API simulation', async ({ page }) => {

    await page.route('**/authenticate', async route => {

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          token: 'fake-jwt-token'
        })
      });

    });

    await page.goto(`${BASE_URL}/login`);

    await page.getByLabel('Username')
      .fill('tomsmith');

    await page.getByLabel('Password')
      .fill('SuperSecretPassword!');

    await page.getByRole('button', {
      name: 'Login'
    }).click();

  });

});