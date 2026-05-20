import { test, expect } from '@playwright/test';

test.describe('DAY 5 — Debugging Like an Automation Engineer', () => {

  // =========================================================
  // GLOBAL DEBUG OBSERVABILITY
  // =========================================================
  test.beforeEach(async ({ page }) => {

    // -------------------------------------------------------
    // REQUEST LOGGING
    // -------------------------------------------------------
    page.on('request', req => {
      console.log(
        `➡️ REQUEST: ${req.method()} ${req.url()}`
      );
    });

    // -------------------------------------------------------
    // RESPONSE LOGGING
    // -------------------------------------------------------
    page.on('response', res => {
      console.log(
        `⬅️ RESPONSE: ${res.status()} ${res.url()}`
      );
    });

    // -------------------------------------------------------
    // CONSOLE ERROR LOGGING
    // -------------------------------------------------------
    page.on('console', msg => {

      if (msg.type() === 'error') {
        console.log(
          `❌ CONSOLE ERROR: ${msg.text()}`
        );
      }

    });

    // -------------------------------------------------------
    // PAGE ERROR LOGGING
    // -------------------------------------------------------
    page.on('pageerror', error => {
      console.log(
        `🔥 PAGE CRASH: ${error.message}`
      );
    });

  });

  // =========================================================
  // TEST 1 — LOCATOR DEBUGGING
  // =========================================================
  test('debug locator issue', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/login'
    );

    await page.getByLabel('Username')
      .fill('tomsmith');

    await page.getByLabel('Password')
      .fill('SuperSecretPassword!');

    // -------------------------------------------------------
    // INTENTIONAL FAILURE
    // -------------------------------------------------------
    // Accessible name is "Login"
    // NOT "LOGIN"
    // This creates a locator mismatch
    // -------------------------------------------------------

    await page.getByRole('button', {
      name: 'LOGIN'
    }).click();

  });

  // =========================================================
  // TEST 2 — FIXED LOCATOR
  // =========================================================
  test('fixed locator investigation', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/login'
    );

    await page.getByLabel('Username')
      .fill('tomsmith');

    await page.getByLabel('Password')
      .fill('SuperSecretPassword!');

    // -------------------------------------------------------
    // FIXED ACCESSIBLE NAME
    // -------------------------------------------------------

    const loginBtn = page.getByRole(
      'button',
      {
        name: 'Login'
      }
    );

    await expect(loginBtn)
      .toBeVisible();

    await loginBtn.click();

    // -------------------------------------------------------
    // BUSINESS ASSERTION
    // -------------------------------------------------------

    await expect(page)
      .toHaveURL(/secure/);

    await expect(page.locator('#flash'))
      .toContainText(
        'You logged into a secure area!'
      );

  });

  // =========================================================
  // TEST 3 — FLAKY TEST INVESTIGATION
  // =========================================================
  test('flaky test investigation', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/dynamic_loading/1'
    );

    await page.getByRole('button', {
      name: 'Start'
    }).click();

    // -------------------------------------------------------
    // RACE CONDITION
    // -------------------------------------------------------
    // textContent() executes immediately
    // DOM may not be ready
    // async rendering still happening
    // -------------------------------------------------------

    await page.waitForSelector('#finish', { state: 'visible' });

    const text = await page.locator('#finish').textContent();
    expect(text?.trim()).toBe('Hello World!');   // await expect(locator).toHaveText('Hello World!');
  });

  // =========================================================
  // TEST 4 — FIXED RACE CONDITION
  // =========================================================
  test('state-driven synchronization', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/dynamic_loading/1'
    );

    await page.getByRole('button', {
      name: 'Start'
    }).click();

    // -------------------------------------------------------
    // STATE-DRIVEN ASSERTION
    // -------------------------------------------------------

    await expect(
      page.locator('#finish')
    ).toHaveText('Hello World!');

  });

  // =========================================================
  // TEST 5 — BAD WAIT VS GOOD WAIT
  // =========================================================
  test('hard wait anti-pattern', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/dynamic_loading/2'
    );

    await page.getByRole('button', {
      name: 'Start'
    }).click();

    // -------------------------------------------------------
    // BAD PRACTICE
    // -------------------------------------------------------

    // await page.waitForTimeout(5000);

    // WHY BAD?
    // - machine dependent
    // - CI timing different
    // - nondeterministic
    // - slower suite

    // -------------------------------------------------------
    // GOOD PRACTICE
    // -------------------------------------------------------

    await expect(
      page.locator('#finish')
    ).toContainText('Hello World!',{
      timeout: 10000
    });

  });

  // =========================================================
  // TEST 6 — NETWORK SYNCHRONIZATION
  // =========================================================
  test('network + navigation debugging', async ({ page }) => {

  page.on('request', req => {
    console.log(
      '➡️',
      req.method(),
      req.url()
    );
  });

  page.on('response', res => {
    console.log(
      '⬅️',
      res.status(),
      res.url()
    );
  });

  await page.goto(
    'https://the-internet.herokuapp.com/login'
  );

  await page.getByLabel('Username')
    .fill('tomsmith');

  await page.getByLabel('Password')
    .fill('SuperSecretPassword!');

  await Promise.all([

    // Observe navigation dependency
    page.waitForURL(/secure/),

    page.getByRole('button', {
      name: 'Login'
    }).click()

  ]);

  // Business state assertion
  await expect(page.locator('#flash'))
    .toContainText(
      'You logged into a secure area!'
    );

});

  // =========================================================
  // TEST 7 — CHECKBOX STATE DEBUGGING
  // =========================================================
  test('checkbox deterministic debugging', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/checkboxes'
    );

    const checkbox = page
      .locator('input[type="checkbox"]')
      .first();

    // -------------------------------------------------------
    // BAD
    // -------------------------------------------------------
    // click() toggles unknown state

    // await checkbox.click();

    // -------------------------------------------------------
    // GOOD
    // -------------------------------------------------------

    await checkbox.check();

    await expect(checkbox)
      .toBeChecked();

  });

  // =========================================================
  // TEST 8 — FILE UPLOAD DEBUGGING
  // =========================================================
  test('file upload debugging', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/upload'
    );

    // -------------------------------------------------------
    // MEMORY-BASED FILE
    // -------------------------------------------------------
    // deterministic
    // CI-safe
    // no filesystem dependency
    // -------------------------------------------------------

    await page.setInputFiles(
      '#file-upload',
      {
        name: 'avatar.png',
        mimeType: 'image/png',
        buffer: Buffer.from('fake image')
      }
    );

    await page.getByRole('button', {
      name: 'Upload'
    }).click();

    await expect(page.locator('h3'))
      .toHaveText('File Uploaded!');

  });

  // =========================================================
  // TEST 9 — OBSERVABILITY ENGINEERING
  // =========================================================
  test('meaningful assertion debugging', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/login'
    );

    await page.getByLabel('Username')
      .fill('wrong-user');

    await page.getByLabel('Password')
      .fill('wrong-password');

    await page.getByRole('button', {
      name: 'Login'
    }).click();

    // -------------------------------------------------------
    // GOOD FAILURE MESSAGE
    // -------------------------------------------------------

    await expect(page.locator('#flash'))
      .toContainText(
        'Your username is invalid!'
      );

  });

});