import { test, expect } from '@playwright/test';


test.describe('Herokuapp Production-like Suite', () => {

  // =========================
  // BEFORE EACH — NETWORK CONTROL
  // =========================
  test.beforeEach(async ({ page }) => {

    // 🔍 LOG ALL REQUESTS (DEBUG MODE)
    page.on('request', req => {
      console.log('➡️ REQUEST:', req.url());
    });

    page.on('response', res => {
      console.log('⬅️ RESPONSE:', res.url(), res.status());
    });

    // =========================
    // MOCK EXAMPLE (LOGIN FLOW SIMULATION)
    // =========================
    // await page.route('**/authenticate', async route => {
    await page.route('**/login', async route => {
      const post = route.request().postData() || '';

      if (post.includes('tomsmith')) {
        return route.fulfill({
          status: 200,
          contentType: 'text/html',
          body: `
            <html>
              <h2>Secure Area</h2>
              <div id="flash">You logged into a secure area!</div>
            </html>
          `
        });
      }

      return route.continue();
    });

  });

  // =========================
  // TEST 1 — LOGIN SUCCESS FLOW
  // =========================
  test('login success flow (state-driven)', async ({ page }) => {

    await page.goto('https://the-internet.herokuapp.com/login', {
      waitUntil: 'domcontentloaded'
    });

    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').fill('SuperSecretPassword!');

    await page.getByRole('button', { name: 'Login' }).click();

    // ✅ STATE-DRIVEN ASSERTION (NOT TIMING)
    await expect(page.locator('#flash'))
      .toContainText('You logged into a secure area!');

    // ⚠️ STRICT LOCATOR FIX (avoid ambiguity)
    await expect(
      page.getByRole('heading', {
        name: 'Secure Area',
        exact: true
      })
    ).toBeVisible();
  });

  // // =========================
  // // TEST 2 — INVALID LOGIN
  // // =========================
  test('login failure shows error', async ({ page }) => {

    await page.goto('https://the-internet.herokuapp.com/login');

    await page.getByLabel('Username').fill('wrong');
    await page.getByLabel('Password').fill('wrong');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.locator('#flash'))
      .toContainText('Your username is invalid!');
  });

  // // =========================
  // // TEST 3 — DYNAMIC LOADING (ASYNC STATE)
  // // =========================
  test('dynamic loading - no flaky wait', async ({ page }) => {

    await page.goto('https://the-internet.herokuapp.com/dynamic_loading/2');

    const startBtn = page.getByRole('button', { name: 'Start' });

    await expect(startBtn).toBeVisible();
    await startBtn.click();

    // ❌ BAD (NO TIMEOUT)
    // await page.waitForTimeout(5000);

    // ✅ GOOD (STATE DRIVEN)
    await expect(
        page.locator('#finish')
        ).toContainText('Hello World!', {
        timeout: 10000
    });


  });

  // // =========================
  // // TEST 4 — UPLOAD FILE (STATE CHECK)
  // // =========================
  test('file upload flow stable assertion', async ({ page }) => {

    await page.goto('https://the-internet.herokuapp.com/upload');


    await page.setInputFiles('#file-upload', 'C:/Users/ASUS/Pictures/2b56590a-7847-4616-a42e-85243a5b59e8.png');

    await page.getByRole('button', { name: 'Upload' }).click();

    await expect(page.locator('h3'))
      .toHaveText('File Uploaded!');  // chính xác tuyệt đối
  });

  // =========================
  // TEST 5 — AUTH STATE SIMULATION (FIXTURE STYLE)
  // =========================
  test('simulate authenticated state', async ({ page }) => {

    await page.goto('https://the-internet.herokuapp.com/login');

    // Tìm input liên kết với label “Username” và "Password".
    await page.getByLabel('Username').fill('tomsmith');
    await page.getByLabel('Password').fill('SuperSecretPassword!');

    // Tìm button có accessible name là Login.
    await page.getByRole('button', {name: 'Login'}).click();
    // 2. ASSERT state, not UI guess
    await expect(page).toHaveURL(/secure/); // authenticate
    

    // 3. THEN assert UI
    await expect(page.locator('h2')).toBeVisible();
    await expect(
      page.getByRole('heading', {
        name: 'Secure Area',  //   name: /^Secure Area$/
        exact: true // Not need
      })
    ).toBeVisible();

    await expect(page.locator('#flash'))
    .toContainText('You logged into a secure area!');
  });
// 

  // =========================
  // TEST 6 — RACE CONDITION DEMO (BAD vs GOOD)
  // =========================
  test('race condition safe assertion', async ({ page }) => {

    await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');

    await page.getByRole('button', { name: 'Start' }).click();

    // ❌ BAD
    // await page.waitForTimeout(3000);

    // ✅ GOOD (ENGINEER MINDSET)
    // await expect(page.locator('#finish'))
    //   .toHaveText('Hello World!');
    await expect(
        page.locator('#finish')
        ).toContainText('Hello World!', {
        timeout: 10000
    });

  });

});