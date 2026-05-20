import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Production-like Registration Flow', () => {

  // ====================================================
  // GLOBAL NETWORK + DEBUG
  // ====================================================
  test.beforeEach(async ({ page }) => {

    // Debug network
    page.on('request', req => {
      console.log('➡️', req.method(), req.url());
    });

    page.on('response', res => {
      console.log('⬅️', res.status(), res.url());
    });

  });

  // ====================================================
  // TEST 1 — FULL REGISTRATION FLOW
  // ====================================================
  test('stable registration flow', async ({ page }) => {

    // ------------------------------------------------
    // STEP 1 — OPEN PAGE
    // ------------------------------------------------
    await page.goto(
      'https://the-internet.herokuapp.com/upload',
      {
        waitUntil: 'domcontentloaded'
      }
    );

    // ====================================================
    // NAME INPUT
    // ====================================================

    // ❌ BAD
    // await page.locator('input').nth(0).fill('John');

    // ✅ GOOD
    // Stable locator mindset
    const nameInput = page.locator('#file-upload');

    await expect(nameInput).toBeVisible();

    // ====================================================
    // FILE UPLOAD
    // ====================================================

    const filePath = path.join(
      __dirname,
      '../avatar.png' // fixtures/avatar.png
    );

    await page.setInputFiles(
      '#file-upload',
      filePath
    );

    // validate file attached
    await expect(nameInput).toHaveValue(/avatar.png/);

    // ====================================================
    // SUBMIT
    // ====================================================

    const uploadBtn = page.getByRole(
      'button',
      { name: 'Upload' }
    );

    await expect(uploadBtn).toBeEnabled();

    await uploadBtn.click();

    // ====================================================
    // SUCCESS STATE
    // ====================================================

    await expect(page.locator('h3'))
      .toHaveText('File Uploaded!');
    // await expect(page.locator('#uploaded-files')).toContainText('sample.pdf');

  });

  // ====================================================
  // TEST 2 — CHECKBOX HANDLING
  // ====================================================
  test('checkbox handling correctly', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/checkboxes'
    );

    const checkbox1 = page.locator(
      'input[type="checkbox"]'
    ).nth(0);

    // const checkbox0 = page.locator('input[type="checkbox"]').first();

    // ❌ BAD
    // await checkbox1.click();

    // WHY BAD?
    // click() can toggle unpredictable state

    // ✅ GOOD
    // deterministic state

    await checkbox1.check();

    await expect(checkbox1).toBeChecked();

    // uncheck explicitly
    await checkbox1.uncheck();

    await expect(checkbox1).not.toBeChecked();

  });

  // ====================================================
  // TEST 3 — DROPDOWN HANDLING
  // ====================================================
  test('dropdown selection stable', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/dropdown'
    );

    // await page.locator('#dropdown').selectOption('1');
    // await expect(page.locator('#dropdown')).toHaveValue('1');

    const dropdown = page.locator('#dropdown');

    // ✅ select by visible text
    await dropdown.selectOption({
      label: 'Option 1'
    });

    await expect(dropdown)
      .toHaveValue('1');

    // ✅ select by value
    await dropdown.selectOption('2');

    await expect(dropdown)
      .toHaveValue('2');

  });

  // ====================================================
  // TEST 4 — LOADING SPINNER
  // ====================================================
  test('loading spinner synchronization', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/dynamic_loading/2'
    );

    const startBtn = page.getByRole(
      'button',
      { name: 'Start' }
    );

    await startBtn.click();

    // ====================================================
    // WHY FLAKY?
    // ====================================================

    // ❌ BAD
    // await page.waitForTimeout(5000);

    // Problems:
    // - CI slower
    // - local faster
    // - network unstable
    // - spinner timing changes

    // ====================================================
    // STATE-DRIVEN WAIT
    // ====================================================

    const helloText = page.locator('#finish');

    await expect(helloText)
      .toContainText('Hello World!', {
        timeout: 10000
      });

  });

  // ====================================================
  // TEST 5 — DELAYED CONTENT
  // ====================================================
  test('delayed rendering content', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/dynamic_loading/1'
    );

    await page.getByRole(
      'button',
      { name: 'Start' }
    ).click();

    const text = page.locator('#finish');

    // ====================================================
    // PLAYWRIGHT AUTO-WAIT
    // ====================================================

    // Playwright auto-waits for:
    // - visible
    // - stable
    // - attached
    // - actionable

    // BUT auto-wait DOES NOT KNOW:
    // - backend finished?
    // - API completed?
    // - animation done?
    // - React hydration done?
    // - websocket completed?

    // So we assert actual business state

    await expect(text)
      .toContainText('Hello World!');

  });

  // ====================================================
  // TEST 6 — TOAST / FLASH MESSAGE
  // ====================================================
  test('toast message assertion', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/login'
    );

    await page.getByLabel('Username')
      .fill('tomsmith');

    await page.getByLabel('Password')
      .fill('SuperSecretPassword!');

    await page.getByRole(
      'button',
      { name: 'Login' }
    ).click();

    const toast = page.locator('#flash');

    // toast often flaky because:
    // - animation
    // - delayed render
    // - auto dismiss

    await expect(toast)
      .toContainText(
        'You logged into a secure area!'
      );

  });

  // ====================================================
  // TEST 7 — EXPLICIT WAIT EXAMPLE
  // ====================================================
  test('explicit synchronization example', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/dynamic_loading/1'
    );

    await page.getByRole(
      'button',
      { name: 'Start' }
    ).click();

    // explicit wait on exact state

    await page.waitForSelector(
      '#finish',
      {
        state: 'visible'
      }
    );

    await expect(
      page.locator('#finish')
    ).toHaveText('Hello World!');

  });

});