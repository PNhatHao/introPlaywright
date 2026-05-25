import { test, expect } from '@playwright/test';

test('day 3 - assertion engineering production flow', async ({ page }) => {

  // =====================================================
  // PHASE 1 — LOGIN (STATE SYNCHRONIZATION)
  // =====================================================

  await page.goto('https://the-internet.herokuapp.com/login');

  await page.getByLabel('Username').fill('tomsmith');
  await page.getByLabel('Password').fill('SuperSecretPassword!');

  const loginBtn = page.getByRole('button', { name: 'Login' });

  // ❗ assertion as synchronization (not just check)
  await expect(loginBtn).toBeEnabled();

  await loginBtn.click();

  // retryable assertion = deterministic wait
  const flash = page.locator('#flash');

  await expect(flash).toBeVisible();
  await expect(flash).toContainText('You logged into a secure area!');

  // redirect validation (state transition)
  await expect(page).toHaveURL(/\/secure$/);

  // =====================================================
  // PHASE 2 — SNAPSHOT vs RETRY ASSERTION COMPARISON
  // =====================================================

  // ❌ snapshot assertion (dangerous)
  const rawText = await flash.textContent();

  // This can be flaky in real apps (demonstration only)
  // expect(rawText).toContain('logged into a secure area');

  // ✅ retry assertion (correct)
  await expect(flash).toContainText('You logged into a secure area!');

  // =====================================================
  // PHASE 3 — DYNAMIC LOADING (EVENTUAL CONSISTENCY)
  // =====================================================

  await page.goto(
    'https://the-internet.herokuapp.com/dynamic_loading/1'
  );

  await page.getByRole('button', { name: 'Start' }).click();

  const spinner = page.locator('#loading');
  const result = page.locator('#finish');

  // ❗ spinner = synchronization signal
  await expect(spinner).toBeVisible();

  // ❗ wait STATE, not TIME
  await expect(spinner).toBeHidden();

  // retry-based assertion handles async rendering
  await expect(result).toHaveText('Hello World!');

  // =====================================================
  // PHASE 4 — WEAK ASSERTION vs STRONG ASSERTION
  // =====================================================

  // ❌ weak assertion (false confidence risk)
  await expect(page.locator('body')).toContainText('Hello');

  // ✅ strong assertion (business-level signal)
  await expect(result).toHaveText('Hello World!');

  // =====================================================
  // PHASE 5 — ASSERTION SCOPE (PRECISION MATTERS)
  // =====================================================

  // ❌ broad assertion (hard debug)
  await expect(page.getByRole('heading', { name: 'Secure Area' }))
    .toBeVisible();
// await expect(page.locator('#finish'))
//   .toHaveText('Hello World!');


  // ✅ precise assertion (production-grade)
  await expect(page.getByRole('heading', { name: 'Secure Area' }))
    .toBeVisible();

  // =====================================================
  // PHASE 6 — DETECT NON-DETERMINISTIC BEHAVIOR
  // =====================================================

  // simulate async-safe validation
  await expect(page.locator('#flash')).toBeVisible();

  // retry ensures deterministic outcome
  await expect(page.locator('#flash'))
    .toContainText('You logged into a secure area!');
});