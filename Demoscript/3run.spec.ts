import { test, expect } from '@playwright/test';

test('production-like registration flow', async ({ page }) => {

  // =====================================
  // PART 1 — REGISTRATION FORM
  // =====================================

  await page.goto('https://the-internet.herokuapp.com/login');

  // name input
  await page.getByLabel('Username')
    .fill('tomsmith');

  // password
  await page.getByLabel('Password')
    .fill('SuperSecretPassword!');

  // fake checkbox simulation
  const rememberCheckbox =
    page.locator('input[type="checkbox"]');

  if (await rememberCheckbox.count() > 0) {
    await rememberCheckbox.check();
  }

  // fake dropdown simulation
  await page.goto('https://the-internet.herokuapp.com/dropdown');

  await page.locator('#dropdown')
    .selectOption('1');

  await expect(page.locator('#dropdown'))
    .toHaveValue('1');

  // =====================================
  // PART 2 — UPLOAD AVATAR
  // =====================================

  await page.goto('https://the-internet.herokuapp.com/upload');

  const filePath =
    'C:/Users/ASUS/Pictures/2b56590a-7847-4616-a42e-85243a5b59e8.png';

  await page.locator('#file-upload')
    .setInputFiles(filePath);

  await page.getByRole('button', {
    name: 'Upload'
  }).click();

  // validate upload success
  await expect(page.locator('h3'))
    .toContainText('File Uploaded!');

  // =====================================
  // PART 3 — SUBMIT FORM
  // =====================================

  await page.goto('https://the-internet.herokuapp.com/login');

  await page.getByLabel('Username')
    .fill('tomsmith');

  await page.getByLabel('Password')
    .fill('SuperSecretPassword!');

  const submitBtn =
    page.getByRole('button', { name: 'Login' });

  // button enabled
  await expect(submitBtn)
    .toBeEnabled();

  await submitBtn.click();

  // =====================================
  // PART 4 — LOADING SPINNER
  // =====================================

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

  // =====================================
  // PART 5 — SUCCESS TOAST
  // =====================================

  await page.goto(
    'https://the-internet.herokuapp.com/login'
  );

  await page.getByLabel('Username')
    .fill('tomsmith');

  await page.getByLabel('Password')
    .fill('SuperSecretPassword!');

  await page.getByRole('button', {
    name: 'Login'
  }).click();

  const toast = page.locator('#flash');

  // toast visible
  await expect(toast)
    .toBeVisible();

  // submit success
  await expect(toast)
    .toContainText(
      'You logged into a secure area!'
    );

  // =====================================
  // PART 6 — REDIRECT SUCCESS
  // =====================================

  await expect(page)
    .toHaveURL(
      'https://the-internet.herokuapp.com/secure'
    );

  // secure area loaded
  await expect(page.locator('h2'))
    .toContainText('Secure Area');
});