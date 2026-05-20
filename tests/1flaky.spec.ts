import { test, expect } from '@playwright/test';

test('dynamic loading correct', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/2');

  await page.getByRole('button', { name: 'Start' }).click();

  const text = await page.locator('#finish h4').textContent();
  expect(text).toContain('Hello World!');
});
