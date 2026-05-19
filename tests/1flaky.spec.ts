import { test, expect } from '@playwright/test';

test('dynamic loading correct', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/dynamic_loading/2');

  await page.getByRole('button', { name: 'Start' }).click();


  //
  const text = await page.locator('#finish h4').textContent();
  expect(text).toContain('Hello World!');
});
// // npx playwright test tests/1flaky.spec.ts --repeat-each=10
// npx playwright test tests/1flaky.spec.ts --debug --project=chromium








// import { test, expect } from '@playwright/test';

// test('bad test with hard wait', async ({ page }) => {
//   await page.goto('https://the-internet.herokuapp.com/dynamic_loading/2');

// Cách khác
// //   await page.getByRole('button', { name: 'Start' }).click();

// //   await expect(
// //     page.getByText('Hello World!')
// //     ).toBeVisible();


// //   await page.click('text=Start');

// //   // Wait cho container xuất hiện trước

// //   // Cách 1: không chạy được vì  toBeVisible
// // //   await expect(page.locator('text=Hello World!')).toBeVisible();

// // //   //  Cách 2 không chạy được vì  toBeVisible
// //   const finishText = page.locator('text=Hello World!');
// //   await expect(finishText).toBeVisible(); 


// -----------------------------------------

//   await page.click('text=Start');

//   // BAD PRACTICE
//   // B1 dòng dòng này waitForTimeout(2000);
//    await page.waitForTimeout(2000);
//   // await page.waitForTimeout(Math.random() * 500);

//   // B2 bỏ 2 dòng này
// //   const text = await page.locator('#finish h4').textContent();

// //   expect(text).toContain('Hello World!');

//   // B3 dùng lệnh này
//   const text = await page.locator('#finish h4').textContent();
//   expect(text).toContain('Hello World!');


//   // chưa chạy được
// //   await expect(page.locator('#finish h4'))
// //   .toHaveText('Hello World!');


// // chưa chạy
// //  const finishText = page.locator('text=Hello World!');

//   //  await expect(finishText).toBeVisible(); 

// });
// // npx playwright test tests/flaky.spec.ts --repeat-each=10



