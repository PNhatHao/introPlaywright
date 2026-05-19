// npx playwright test fixture tests/heroku.spec.ts --debug --project=chromium 

import { test, expect } from '../fixtures/auth.fixture';

test.describe('Production-like Heroku Suite', () => {

  // =========================
  // DASHBOARD TEST
  // =========================
  test('dashboard authenticated state', async ({ loggedInPage }) => {

    await expect(loggedInPage)
      .toHaveURL(/secure/);

    await expect(
      loggedInPage.locator('#flash')
    ).toContainText(
      'You logged into a secure area!'
    );

  });

  // =========================
  // DYNAMIC LOADING
  // =========================
  test('dynamic loading stable', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/dynamic_loading/2'
    );

    await page.getByRole('button', {
      name: 'Start'
    }).click();

    await expect(
      page.locator('#finish')
    ).toContainText(
      'Hello World!',
      {
        timeout: 10000
      }
    );
  });

  // =========================
  // FILE UPLOAD
  // =========================
  test('upload stable assertion', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/upload'
    );

    await page.setInputFiles(
      '#file-upload',
      'C:/Users/ASUS/Pictures/2b56590a-7847-4616-a42e-85243a5b59e8.png'
    );

    await page.getByRole('button', {
      name: 'Upload'
    }).click();

    await expect(
      page.locator('h3')
    ).toHaveText('File Uploaded!');
  });

});


// Nếu bạn muốn bước tiếp theo

// Tui có thể giúp bạn build luôn:

// 🔥 Full Enterprise Playwright Framework

// gồm:

// Page Object Model
// API layer
// Fixture layer
// Test data factory
// CI pipeline structure
// flaky test handling system

// Chỉ cần nói: "scale lên production framework"