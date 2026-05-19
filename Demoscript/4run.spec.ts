// Full Production-like Playwright Test
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

    // await page.setInputFiles('#file-upload', {
    //   name: 'test.png',
    //   mimeType: 'image/png',
    //   buffer: Buffer.from('fake image content')
    // });
  await page.setInputFiles('#file-upload', 'C:/Users/ASUS/Pictures/2b56590a-7847-4616-a42e-85243a5b59e8.png');
  // ------------
  // const filePath =
  //   'C:/Users/ASUS/Pictures/2b56590a-7847-4616-a42e-85243a5b59e8.png';
  //   await page.getByRole('button', {
  //   name: 'Upload'
  // }).click();
  // // validate upload success
  // await expect(page.locator('h3'))
  //   .toContainText('File Uploaded!');  // Text có thể chứa thêm kí tự
  //--------------------------- 
    await page.getByRole('button', { name: 'Upload' }).click();

    await expect(page.locator('h3'))
      .toHaveText('File Uploaded!');  // chính xác tuyệt đối
  });

  // =========================
  // TEST 5 — AUTH STATE SIMULATION (FIXTURE STYLE)
  // =========================
  test('simulate authenticated state', async ({ page }) => {

    // Không có tác dụng nhìu 
    // fake auth cookie (demo purpose)
    // await page.context().addCookies([{
    //   name: 'auth',
    //   value: 'fake-token',
    //   domain: 'the-internet.herokuapp.com',
    //   path: '/'
    // }]);

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









// npx playwright test Demoscript/4run.spec.ts --debug --project=chromium  
// npx playwright test Demoscript/2LoginTest.spec.ts --repeat-each=10
          
// npx playwright test Demoscript/4run.spec.ts --trace on







// 🧠 PHÂN TÍCH ARCHITECTURE (QUAN TRỌNG NHẤT)
// 1. Layer separation
// UI Layer        → Playwright assertions
// API Layer       → route.mock / intercept
// Auth Layer      → storageState
// State Layer     → isolated per test
// 2. Vì sao test này "production-like"?
// ✔ Không phụ thuộc backend thật

// → dùng mock API

// ✔ Không login mỗi test

// → storageState reuse

// ✔ Không shared state

// → mỗi test independent

// ✔ Có negative test

// → 500 / 401 simulation

// ✔ Có network control

// → intercept toàn bộ API

// 3. Flaky test đã bị loại bỏ vì:

// ❌ không dùng:

// waitForTimeout
// hard sleep
// timing assumption

// ✔ chỉ dùng:

// expect retry
// network state
// UI state
// 🚀 KEY MINDSET (DAY 4 LEVEL)
// Automation = controlling system state, not clicking UI






// # 🗓️ Tuần 1 – Ngày 4 (Engineering Mindset Version)




// # Chủ đề:

// # Network Interception + API Mocking + Auth Handling + Fixture Architecture + Test Isolation

// Đây là ngày bắt đầu transition mạnh từ:

// > “UI automation”

// sang:

// > “test engineering”.

// Từ hôm nay bạn sẽ bắt đầu hiểu:

// * frontend và backend connect thế nào
// * test isolation quan trọng ra sao
// * vì sao API mocking giúp giảm flaky
// * tại sao auth handling là vấn đề lớn
// * vì sao architecture quyết định maintainability

// Đây là phần mà nhiều QA automation junior bị hổng rất nặng.

// ---

// # 🎯 Mục tiêu Ngày 4

// Sau hôm nay bạn phải hiểu:

// * browser và network relation
// * intercept request/responses
// * mock API để stabilize test
// * auth state reuse
// * fixture là gì
// * test isolation nghĩa là gì
// * vì sao shared state gây flaky CI

// ---

// # PHẦN 1 — Automation thật sự không chỉ là UI

// Beginner mindset:

// ```text id="5w7x27"
// click button → verify text
// ```

// Engineer mindset:

// ```text id="hj2a2o"
// UI ← API ← backend ← database
// ```

// UI chỉ là surface layer.

// Phần lớn flaky test thực ra đến từ:

// * network
// * async API
// * shared data
// * unstable backend
// * auth/session

// ---

// # PHẦN 2 — Vì sao Network hiểu biết cực kỳ quan trọng?

// Ví dụ:

// User click login.

// Thực tế:

// ```text id="6vh0vc"
// Browser
//   ↓
// POST /login
//   ↓
// Backend validate
//   ↓
// JWT/token
//   ↓
// Frontend store auth
//   ↓
// Redirect dashboard
// ```

// ---

// # Nếu test fail, nguyên nhân có thể là:

// * button fail?
// * API fail?
// * token fail?
// * redirect fail?
// * backend slow?
// * 500 error?
// * CORS?
// * timeout?

// Engineer phải debug theo flow này.

// ---

// # PHẦN 3 — Intercept Network Request

// Đây là superpower của Playwright.

// ---

// # Example

// ```ts id="k4gq64"
// page.on('request', request => {
//   console.log(request.url());
// });
// ```

// Observe tất cả request.

// ---

// # Response logging

// ```ts id="fg4hpa"
// page.on('response', response => {
//   console.log(response.status());
// });
// ```

// ---

// # Đây cực kỳ useful khi debug:

// * API fail
// * unexpected request
// * retry loop
// * redirect issue

// ---

// # PHẦN 4 — API Mocking (CỰC KỲ QUAN TRỌNG)

// Production backend thường:

// * unstable
// * slow
// * rate limited
// * random data
// * environment dirty

// Nếu phụ thuộc hoàn toàn backend:
// => flaky hell.

// ---

// # Mocking giúp gì?

// ## Before

// ```text id="m32mry"
// UI test depends on real backend
// ```

// Problems:

// * slow
// * unstable
// * hard reproduce

// ---

// # After

// ```text id="2c0hcf"
// UI test + fake API response
// ```

// Benefits:

// * deterministic
// * fast
// * isolated
// * predictable

// ---

// # Example mock

// ```ts id="d3n7lf"
// await page.route('**/api/users', async route => {
//   await route.fulfill({
//     status: 200,
//     contentType: 'application/json',
//     body: JSON.stringify([
//       { id: 1, name: 'John' }
//     ])
//   });
// });
// ```

// ---

// # Điều cực kỳ quan trọng:

// Bạn đang test:

// * UI rendering
// * frontend logic

// KHÔNG phải backend.

// ---

// # PHẦN 5 — Khi nào nên mock?

// ## ✅ Good mock cases

// * unstable API
// * expensive external service
// * payment gateway
// * OTP
// * email verification
// * edge case data
// * error simulation

// ---

// # ❌ Không nên mock everything

// Nếu mock toàn bộ:

// * mất integration confidence
// * fake environment
// * miss real issue

// ---

// # Engineer mindset:

// ## Mix:

// * real integration test
// * mocked UI test

// ---

// # PHẦN 6 — Mock Error Response

// Đây là kỹ năng cực mạnh.

// ---

// # Simulate 500

// ```ts id="1s1xy8"
// await page.route('**/api/login', async route => {
//   await route.fulfill({
//     status: 500,
//     body: 'Internal Server Error'
//   });
// });
// ```

// ---

// # Verify UI handling

// ```ts id="d5xvqo"
// await expect(page.getByRole('alert'))
//   .toContainText('Something went wrong');
// ```

// ---

// # Đây là testing mindset thật sự:

// Không chỉ happy path.

// ---

// # PHẦN 7 — Authentication Handling

// Login UI mỗi test là anti-pattern rất phổ biến.

// ---

// # ❌ Bad practice

// ```text id="svw67z"
// Every test:
// - open login
// - type username
// - type password
// - click login
// ```

// Problems:

// * slow
// * duplicate
// * flaky
// * auth dependency

// ---

// # Better approach:

// Reuse authenticated state.

// ---

// # Playwright auth storage

// ## Save auth state

// ```ts id="1ijjlwm"
// await page.context().storageState({
//   path: 'auth.json'
// });
// ```

// ---

// # Reuse

// ```ts id="fyx0pj"
// use: {
//   storageState: 'auth.json'
// }
// ```

// ---

// # Đây là production-grade practice.

// ---

// # PHẦN 8 — Fixture Architecture (CỰC KỲ QUAN TRỌNG)

// Junior thường viết:

// ```ts id="n5f08v"
// test('A', async ({ page }) => {
//   login code...
// });

// test('B', async ({ page }) => {
//   login code...
// });
// ```

// Duplication hell.

// ---

// # Fixture solve gì?

// * reuse setup
// * cleaner test
// * shared utility
// * separation of concern

// ---

// # Example custom fixture

// ```ts id="d6kewx"
// export const test = base.extend({
//   loggedInPage: async ({ page }, use) => {
//     await login(page);

//     await use(page);
//   }
// });
// ```

// ---

// # Test becomes

// ```ts id="4axdxg"
// test('dashboard', async ({ loggedInPage }) => {
//   await expect(loggedInPage)
//     .toHaveURL(/dashboard/);
// });
// ```

// ---

// # Đây là architecture mindset.

// ---

// # PHẦN 9 — Test Isolation (SIÊU QUAN TRỌNG)

// Đây là concept cực kỳ quan trọng trong CI.

// ---

// # Test tốt phải:

// ## Independent

// Không phụ thuộc:

// * execution order
// * shared account
// * previous test
// * leftover state

// ---

// # ❌ Dangerous

// ```text id="d6k6y0"
// Test B only passes if Test A ran first
// ```

// CI sẽ nightmare.

// ---

// # Good isolation

// Mỗi test:

// * self-contained
// * own setup
// * own cleanup

// ---

// # Browser Context isolation

// Playwright giúp:

// * cookies isolated
// * localStorage isolated
// * session isolated

// Nhưng:

// * backend data vẫn có thể shared.

// ---

// # PHẦN 10 — State Pollution

// Ví dụ:

// Test A:

// ```text id="l53sqt"
// create user
// ```

// Test B:

// ```text id="wlm1wc"
// expect no users
// ```

// => flaky random.

// ---

// # Engineer phải manage:

// * seed data
// * cleanup
// * unique test data
// * independent state

// ---

// # PHẦN 11 — Dynamic Test Data

// ## ❌ Dangerous

// ```ts id="55pwnz"
// email = test@gmail.com
// ```

// Fails eventually.

// ---

// # Better

// ```ts id="mznjlwm"
// const email = `test-${Date.now()}@mail.com`;
// ```

// ---

// # Nhưng production-grade còn tốt hơn:

// * faker
// * UUID
// * data factory

// ---

// # PHẦN 12 — Mini Real Project

// ## Scenario:

// Dashboard app:

// * login
// * fetch user API
// * render table
// * upload avatar
// * error handling

// ---

// # Requirements

// ## Test:

// * successful render
// * API 500 handling
// * loading spinner
// * authenticated access
// * unauthorized redirect

// ---

// # Đây bắt đầu giống real automation project.

// ---

// # PHẦN 13 — Debug Network Like Engineer

// ## Open DevTools Network

// Observe:

// * request timing
// * failed status
// * duplicate request
// * retry
// * websocket

// ---

// # Playwright Trace Viewer

// ```bash id="qlbmnn"
// npx playwright show-trace trace.zip
// ```

// Observe:

// * network waterfall
// * console error
// * timing
// * DOM snapshot

// ---

// # Đây là kỹ năng rất mạnh.

// ---

// # PHẦN 14 — Câu hỏi phỏng vấn thực chiến

// ---

// # 1. Vì sao API mocking quan trọng?

// Good answer:

// * deterministic
// * faster
// * isolate frontend
// * easier edge case testing

// ---

// # 2. Vì sao login mỗi test là anti-pattern?

// * slow
// * duplicated
// * flaky
// * unnecessary dependency

// ---

// # 3. Test isolation là gì?

// Test:

// * independent
// * reproducible
// * order-independent

// ---

// # 4. Khi nào KHÔNG nên mock?

// * full integration test
// * E2E confidence
// * backend validation flow

// ---

// # 5. Shared state gây issue gì?

// * flaky CI
// * random fail
// * non-deterministic behavior

// ---

// # Deliverable cuối ngày

// Bạn nên có:

// ## ✅ API mock test

// ## ✅ error response simulation

// ## ✅ auth state reuse

// ## ✅ basic fixture

// ## ✅ isolated test mindset

// ## ✅ hiểu network debugging

// ## ✅ hiểu frontend/backend interaction

// ---

// # Homework tối nay

// ## 1. Mock success + error response

// Practice:

// * 200
// * 400
// * 500

// ---

// # 2. Observe real network

// Mở:

// * DevTools
// * Network tab

// Quan sát:

// * XHR
// * fetch
// * timing
// * payload

// ---

// # 3. Refactor duplicate login

// Move thành:

// * helper
// * fixture

// ---

// # 4. Create flaky shared-state intentionally

// Rồi:

// * parallel run
// * repeat-each

// Observe CI-like failure.

// ---

// # Điều quan trọng nhất hôm nay

// Automation engineer mạnh không chỉ:

// > biết click UI

// Mà hiểu:

// * browser
// * network
// * async system
// * state management
// * isolation
// * architecture

// Ngày 5 sẽ bắt đầu:

// * Page Object Model đúng cách
// * test architecture
// * reusable components
// * maintainability
// * anti-patterns
// * scaling automation suite
// * CI/CD mindset

// Đây là lúc bạn bắt đầu học:

// > viết automation như software project thật.
