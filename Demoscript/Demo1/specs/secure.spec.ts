// // npx playwright test fixture tests/heroku.spec.ts --debug --project=chromium 

// import { test, expect } from '../../Demoscript/Demo1/fixtures1/auth1.fixture';

// test.describe('Secure Area Suite', () => {

//   // ========================================
//   // TEST 1 — AUTHENTICATED USER
//   // ========================================
//   test('authenticated user sees dashboard',
//     async ({ loggedInPage }) => {

//       await expect(
//         loggedInPage.getByRole('heading', {
//           level: 2,
//           name: 'Secure Area'
//         })
//       ).toBeVisible();

//       await expect(
//         loggedInPage.locator('#flash')
//       ).toContainText(
//         'You logged into a secure area!'
//       );

//     });

//   // ========================================
//   // TEST 2 — DYNAMIC LOADING
//   // ========================================
//   test('dynamic loading without flaky waits',
//     async ({ page }) => {

//       await page.goto(
//         'https://the-internet.herokuapp.com/dynamic_loading/2'
//       );

//       await page.getByRole('button', {
//         name: 'Start'
//       }).click();

//       await expect(
//         page.locator('#finish')
//       ).toContainText('Hello World!', {
//         timeout: 10000
//       });

//     });

//   // ========================================
//   // TEST 3 — FILE UPLOAD
//   // ========================================
//   test('stable file upload flow',
//     async ({ page }) => {

//       await page.goto(
//         'https://the-internet.herokuapp.com/upload'
//       );

//       await page.setInputFiles(
//         '#file-upload',
//         'C:/Users/ASUS/Pictures/2b56590a-7847-4616-a42e-85243a5b59e8.png'
//       );

//       await page.getByRole('button', {
//         name: 'Upload'
//       }).click();

//       await expect(
//         page.locator('h3')
//       ).toHaveText('File Uploaded!');

//     });

// });