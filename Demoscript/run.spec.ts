// npx playwright test Demoscript/run.spec.ts --debug --project=chromium  
// npx playwright test Demoscript/run.spec.ts --repeat-each=10
          
// npx playwright test Demoscript/run.spec.ts --trace on
// Full Production-like Playwright Test
import { test, expect } from '@playwright/test';
import path from 'path';


  // ====================================================
  // TEST 1 — FULL REGISTRATION FLOW
  // ====================================================
  // test('stable registration flow', async ({ page }) => {

  //   // ------------------------------------------------
  //   // STEP 1 — OPEN PAGE
  //   // ------------------------------------------------
  //   await page.goto(
  //     'https://the-internet.herokuapp.com/upload',
  //     {
  //       waitUntil: 'domcontentloaded'
  //     }
  //   );

  //   // ====================================================
  //   // NAME INPUT
  //   // ====================================================

  //   // ❌ BAD
  //   // await page.locator('input').nth(0).fill('John');

  //   // ✅ GOOD
  //   // Stable locator mindset
  //   const nameInput = page.locator('#file-upload');

  //   await expect(nameInput).toBeVisible();

  //   // ====================================================
  //   // FILE UPLOAD
  //   // ====================================================

  //   const filePath = path.join(
  //     __dirname,
  //     '../avatar.png' // fixtures/avatar.png
  //   );

  //   await page.setInputFiles(
  //     '#file-upload',
  //     filePath
  //   );

  //   // validate file attached
  //   await expect(nameInput).toHaveValue(/avatar.png/);

  //   // ====================================================
  //   // SUBMIT
  //   // ====================================================

  //   const uploadBtn = page.getByRole(
  //     'button',
  //     { name: 'Upload' }
  //   );

  //   await expect(uploadBtn).toBeEnabled();

  //   await uploadBtn.click();

  //   // ====================================================
  //   // SUCCESS STATE
  //   // ====================================================

  //   await expect(page.locator('h3'))
  //     .toHaveText('File Uploaded!');

  // });

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

