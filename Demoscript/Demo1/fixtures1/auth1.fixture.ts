// npx playwright test fixture tests/heroku.spec.ts --debug --project=chromium 
// npx playwright test tests/heroku.spec.ts --debug --project=chromium


// playwright fixtures
// playwright authentication
// playwright test architecture


// playwright fixture tutorial
// playwright auth state
// playwright page object model

import { test as base, expect } from '@playwright/test';

type MyFixtures = {
  loggedInPage: any;
};

export const test = base.extend<MyFixtures>({

  loggedInPage: async ({ page }, use) => {

    // =========================
    // NETWORK LOGGING
    // =========================
    page.on('request', req => {
      console.log('➡️ REQUEST:', req.url());
    });

    page.on('response', res => {
      console.log('⬅️ RESPONSE:', res.url(), res.status());
    });

    // =========================
    // LOGIN
    // =========================
    await page.goto('https://the-internet.herokuapp.com/login');

    await page.getByLabel('Username')
      .fill('tomsmith');

    await page.getByLabel('Password')
      .fill('SuperSecretPassword!');

    await page.getByRole('button', {
      name: 'Login'
    }).click();

    // =========================
    // ASSERT AUTH STATE
    // =========================
    await expect(page)
      .toHaveURL(/secure/);

    await expect(
      page.getByRole('heading', {
        name: 'Secure Area',
        exact: true
      })
    ).toBeVisible();

    // expose page to test
    await use(page);
  }

});

export { expect };







// Để học đúng phần **Fixture Architecture + Production-like Playwright**, YouTube rất nhiều video nhưng đa số chỉ dừng ở “UI automation”.

// Tui recommend mấy nguồn này vì họ đi đúng mindset engineering:

// ---

// # 1. Official Playwright — Fixtures (BEST)

// [Playwright Fixtures Documentation](https://playwright.dev/docs/test-fixtures?utm_source=chatgpt.com)

// Video:

// [Playwright YouTube Channel](https://www.youtube.com/@playwrightdev?utm_source=chatgpt.com)

// Search trong channel:

// * `playwright fixtures`
// * `playwright authentication`
// * `playwright test architecture`

// ---

// # 2. Production-level Playwright Architecture

// ### Automation Step by Step

// [Automation Step by Step YouTube](https://www.youtube.com/@AutomationStepByStep?utm_source=chatgpt.com)

// Search:

// * `playwright fixture tutorial`
// * `playwright auth state`
// * `playwright page object model`

// Channel này giải thích:

// * fixture
// * hooks
// * auth reuse
// * structure project

// khá beginner-friendly.

// ---

// # 3. QA Box — Real Framework Structure

// [QA Box YouTube](https://www.youtube.com/@qaboxletstest?utm_source=chatgpt.com)

// Search:

// * `playwright framework from scratch`
// * `playwright fixtures`
// * `playwright api mocking`

// Điểm mạnh:

// * folder architecture
// * CI mindset
// * reusable components

// ---

// # 4. Checkly — Engineer Mindset rất mạnh

// [Checkly YouTube](https://www.youtube.com/@checklyhq?utm_source=chatgpt.com)

// Đây gần production engineering hơn QA tutorial thông thường.

// Search:

// * `playwright best practices`
// * `avoid flaky tests`
// * `playwright architecture`

// ---

// # 5. Network + Mocking + Intercept

// Official docs rất mạnh phần này:

// [Playwright Mock APIs Guide](https://playwright.dev/docs/mock?utm_source=chatgpt.com)

// [Playwright Network Guide](https://playwright.dev/docs/network?utm_source=chatgpt.com)

// Đây là core của:

// * API mocking
// * route.fulfill
// * route.continue
// * intercept request
// * response inspection

// ---

// # Thứ tự học đúng cho bạn lúc này

// ## STEP 1 — Fixtures

// Học:

// * `base.extend`
// * custom fixture
// * shared setup
// * auth fixture

// ---

// ## STEP 2 — Auth State

// Học:

// * storageState
// * save login session
// * reuse authenticated browser

// ---

// ## STEP 3 — Architecture

// Refactor project thành:

// ```txt
// tests/
// pages/
// fixtures/
// utils/
// data/
// playwright.config.ts
// ```

// ---

// ## STEP 4 — Network Mocking

// Học:

// * route()
// * fulfill()
// * continue()
// * abort()

// ---

// ## STEP 5 — CI mindset

// Học:

// * parallel
// * retries
// * flaky handling
// * isolation

// ---

// # Sau khi xem xong nên practice gì

// ## Refactor project hiện tại:

// ### BEFORE

// ```ts
// test('login', async ({ page }) => {
//   // login code
// });
// ```

// ---

// ### AFTER

// ```ts
// test('dashboard', async ({ loggedInPage }) => {
//   // business logic only
// });
// ```

// Đây là transition:

// * junior automation
//   → test engineer mindset.

// ---

// # Recommendation cực mạnh cho bạn

// Đừng chỉ:

// * copy code
// * chạy pass

// Hãy luôn hỏi:

// ```txt
// Why does this architecture reduce flaky?
// Why is this reusable?
// Why isolate state?
// Why avoid duplicated login?
// ```

// Đó mới là phần phân biệt:

// * “người biết Playwright”
//   vs
// * “automation engineer”.
