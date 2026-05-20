import { test, expect } from '@playwright/test';

test.describe('DAY 4 - Synchronization Engineering', () => {

  test('GOOD — state-driven synchronization', async ({ page }) => {

    // =========================================
    // PART 1 — Dynamic Loading
    // =========================================

    await page.goto(
      'https://the-internet.herokuapp.com/dynamic_loading/2'
    );

    const startBtn = page.getByRole('button', {
      name: 'Start'
    });

    await expect(startBtn)
      .toBeVisible();

    await startBtn.click();

    // Spinner appears
    const spinner = page.locator('#loading');

    await expect(spinner).toBeVisible();

    await expect(
    page.locator('#finish')
    ).toContainText('Hello World!', {
    timeout: 10000
    });

    // =========================================
    // PART 2 — Login Synchronization
    // =========================================

    await page.goto(
      'https://the-internet.herokuapp.com/login'
    );

    await page.getByLabel('Username')
      .fill('tomsmith');

    await page.getByLabel('Password')
      .fill('SuperSecretPassword!');

    const loginBtn = page.getByRole('button', {
      name: 'Login'
    });

    await expect(loginBtn)
      .toBeEnabled();

    await loginBtn.click();

    // Wait observable success state
    const toast = page.locator('#flash');

    await expect(toast)
      .toBeVisible();

    await expect(toast)
      .toContainText(
        'You logged into a secure area!'
      );

    // URL synchronization
    await expect(page)
      .toHaveURL(
        'https://the-internet.herokuapp.com/secure'
      );

    // Final render stable
      await expect(
        page.getByRole('heading', {
        name: 'Secure Area',  //   name: /^Secure Area$/
        exact: true
        })
    ).toBeVisible();

    await expect(page.locator('#flash'))
  .toContainText('You logged into a secure area!');
  });

  test('BAD — flaky timing example', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/dynamic_loading/2'
    );

    await page.getByRole('button', {
      name: 'Start'
    }).click();

    // BAD PRACTICE
    // Timing assumption only

    await page.waitForTimeout(2000);

    // Race condition possible
    const text = await page
      .locator('#finish')
      .textContent();

    expect(text).toBe('Hello World!');

  });

  test('BETTER — deterministic synchronization', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/dynamic_loading/2'
    );

    await page.getByRole('button', {
      name: 'Start'
    }).click();

    // Wait actual observable state
    await expect(
        page.locator('#finish')
        ).toContainText('Hello World!', {
        timeout: 10000
    });

  });

  test('NETWORK synchronization example', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/login'
    );

    await Promise.all([

      // Wait network event
      page.waitForResponse(resp =>
        resp.url().includes('/authenticate')
      ),

      // Trigger action
      page.getByRole('button', {
        name: 'Login'
      }).click()

    ]).catch(() => {
      // Demo only
    });
  });
});

// npx playwright test tests/4Strategy.spec.ts --debug --project=chromium
// // npx playwright test tests/3assertion.spec.ts --repeat-each=10
// npx playwright test tests/4Strategy.spec.ts --trace on
