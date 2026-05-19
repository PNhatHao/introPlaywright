//  npx playwright test Demoscript/3UI.spec.ts --debug --project=chromium    

import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Production-like Registration Flow', () => {

  // ====================================================
  // GLOBAL NETWORK + DEBUG
  // ====================================================
  test.beforeEach(async ({ page }) => {

    // Debug network
    page.on('request', req => {
      console.log('➡️', req.method(), req.url());
    });

    page.on('response', res => {
      console.log('⬅️', res.status(), res.url());
    });

  });

  // ====================================================
  // TEST 1 — FULL REGISTRATION FLOW
  // ====================================================
  test('stable registration flow', async ({ page }) => {

    // ------------------------------------------------
    // STEP 1 — OPEN PAGE
    // ------------------------------------------------
    await page.goto(
      'https://the-internet.herokuapp.com/upload',
      {
        waitUntil: 'domcontentloaded'
      }
    );

    // ====================================================
    // NAME INPUT
    // ====================================================

    // ❌ BAD
    // await page.locator('input').nth(0).fill('John');

    // ✅ GOOD
    // Stable locator mindset
    const nameInput = page.locator('#file-upload');

    await expect(nameInput).toBeVisible();

    // ====================================================
    // FILE UPLOAD
    // ====================================================

    const filePath = path.join(
      __dirname,
      '../avatar.png' // fixtures/avatar.png
    );

    await page.setInputFiles(
      '#file-upload',
      filePath
    );

    // validate file attached
    await expect(nameInput).toHaveValue(/avatar.png/);

    // ====================================================
    // SUBMIT
    // ====================================================

    const uploadBtn = page.getByRole(
      'button',
      { name: 'Upload' }
    );

    await expect(uploadBtn).toBeEnabled();

    await uploadBtn.click();

    // ====================================================
    // SUCCESS STATE
    // ====================================================

    await expect(page.locator('h3'))
      .toHaveText('File Uploaded!');
    // await expect(page.locator('#uploaded-files')).toContainText('sample.pdf');

  });

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

    // const checkbox0 = page.locator('input[type="checkbox"]').first();

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

  // ====================================================
  // TEST 3 — DROPDOWN HANDLING
  // ====================================================
  test('dropdown selection stable', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/dropdown'
    );

    // await page.locator('#dropdown').selectOption('1');
    // await expect(page.locator('#dropdown')).toHaveValue('1');

    const dropdown = page.locator('#dropdown');

    // ✅ select by visible text
    await dropdown.selectOption({
      label: 'Option 1'
    });

    await expect(dropdown)
      .toHaveValue('1');

    // ✅ select by value
    await dropdown.selectOption('2');

    await expect(dropdown)
      .toHaveValue('2');

  });

  // ====================================================
  // TEST 4 — LOADING SPINNER
  // ====================================================
  test('loading spinner synchronization', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/dynamic_loading/2'
    );

    const startBtn = page.getByRole(
      'button',
      { name: 'Start' }
    );

    await startBtn.click();

    // ====================================================
    // WHY FLAKY?
    // ====================================================

    // ❌ BAD
    // await page.waitForTimeout(5000);

    // Problems:
    // - CI slower
    // - local faster
    // - network unstable
    // - spinner timing changes

    // ====================================================
    // STATE-DRIVEN WAIT
    // ====================================================

    const helloText = page.locator('#finish');

    await expect(helloText)
      .toContainText('Hello World!', {
        timeout: 10000
      });

  });

  // ====================================================
  // TEST 5 — DELAYED CONTENT
  // ====================================================
  test('delayed rendering content', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/dynamic_loading/1'
    );

    await page.getByRole(
      'button',
      { name: 'Start' }
    ).click();

    const text = page.locator('#finish');

    // ====================================================
    // PLAYWRIGHT AUTO-WAIT
    // ====================================================

    // Playwright auto-waits for:
    // - visible
    // - stable
    // - attached
    // - actionable

    // BUT auto-wait DOES NOT KNOW:
    // - backend finished?
    // - API completed?
    // - animation done?
    // - React hydration done?
    // - websocket completed?

    // So we assert actual business state

    await expect(text)
      .toContainText('Hello World!');

  });

  // ====================================================
  // TEST 6 — TOAST / FLASH MESSAGE
  // ====================================================
  test('toast message assertion', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/login'
    );

    await page.getByLabel('Username')
      .fill('tomsmith');

    await page.getByLabel('Password')
      .fill('SuperSecretPassword!');

    await page.getByRole(
      'button',
      { name: 'Login' }
    ).click();

    const toast = page.locator('#flash');

    // toast often flaky because:
    // - animation
    // - delayed render
    // - auto dismiss

    await expect(toast)
      .toContainText(
        'You logged into a secure area!'
      );

  });

  // ====================================================
  // TEST 7 — EXPLICIT WAIT EXAMPLE
  // ====================================================
  test('explicit synchronization example', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/dynamic_loading/1'
    );

    await page.getByRole(
      'button',
      { name: 'Start' }
    ).click();

    // explicit wait on exact state

    await page.waitForSelector(
      '#finish',
      {
        state: 'visible'
      }
    );

    await expect(
      page.locator('#finish')
    ).toHaveText('Hello World!');

  });

});

// npx playwright test Demoscript/2LoginTest.spec.ts --debug --project=chromium
// npx playwright test Demoscript/2LoginTest.spec.ts --repeat-each=10









// # 🗓️ Tuần 1 – Ngày 3 (Engineering Mindset Version)

// # Chủ đề:

// # Dynamic UI + Wait Strategy + Checkbox/Dropdown/File Upload + Synchronization

// Đây là ngày bắt đầu “đụng production reality”.

// Ngày 1–2:

// * locator
// * assertion
// * basic flow

// Ngày 3:

// * timing issue
// * dynamic rendering
// * synchronization
// * flaky behavior
// * async UI

// Đây là nơi nhiều automation test bắt đầu fail trên CI.

// ---

// # 🎯 Mục tiêu Ngày 3

// Sau hôm nay bạn phải hiểu:

// * vì sao UI động gây flaky
// * implicit wait vs explicit wait
// * khi nào Playwright auto-wait KHÔNG đủ
// * cách handle:

//   * checkbox
//   * dropdown
//   * upload
//   * loading spinner
//   * delayed content
// * synchronization mindset
// * deterministic testing

// ---

// # PHẦN 1 — Dynamic UI là gì?

// Modern web app KHÔNG render instantly.

// Ví dụ:

// * loading spinner
// * async API
// * delayed button
// * debounce input
// * animation
// * lazy loading
// * virtual DOM rerender

// ---

// # Đây là nguyên nhân lớn nhất gây flaky test

// Beginner nghĩ:

// > “element có trên màn hình rồi”

// Reality:

// * chưa stable
// * chưa clickable
// * data chưa xong
// * animation chưa end
// * API chưa resolve

// ---

// # PHẦN 2 — Playwright Auto-wait có giới hạn

// Nhiều người hiểu sai:

// > “Playwright tự wait hết”

// Không.

// ---

// # Playwright chỉ auto-wait cho:

// ## Actionability

// Ví dụ click:

// ```ts id="x0r6db"
// await button.click();
// ```

// Playwright wait:

// * visible
// * enabled
// * stable
// * attached

// ---

// # Nhưng KHÔNG biết:

// * backend response đúng chưa
// * spinner đã xong chưa
// * data loaded chưa
// * business state ready chưa

// ---

// # Đây là nơi engineer phải tự synchronize

// ---

// # PHẦN 3 — Checkbox

// ## Practice site

// [The Internet Checkboxes](https://the-internet.herokuapp.com/checkboxes?utm_source=chatgpt.com)

// ---

// # ❌ Beginner style

// ```ts id="f0jkvh"
// await page.locator('input').nth(0).click();
// ```

// Problem:

// * coupling position
// * fail nếu UI reorder

// ---

// # ✅ Better

// ```ts id="p6lzdf"
// const checkbox = page.locator('input[type="checkbox"]').first();

// await checkbox.check();

// await expect(checkbox).toBeChecked();
// ```

// ---

// # Vì sao `check()` tốt hơn `click()`?

// `check()`:

// * semantic action
// * auto verify checked state
// * retry tốt hơn

// ---

// # Engineer mindset:

// ## Prefer intent-based API

// Không phải:

// > click random thing

// Mà:

// > ensure checkbox checked

// ---

// # PHẦN 4 — Radio Button

// Radio button thường gây issue:

// * hidden input
// * custom UI wrapper
// * animation

// ---

// # Ví dụ:

// ```ts id="lkpkl2"
// await page.getByLabel('Option 1').check();

// await expect(
//   page.getByLabel('Option 1')
// ).toBeChecked();
// ```

// ---

// # Nhưng production thường có custom component

// Ví dụ React:

// ```html id="80f4f6"
// <div class="radio-ui"></div>
// <input hidden />
// ```

// Lúc này:

// * click wrapper
// * verify hidden input state

// Đây là thực tế rất phổ biến.

// ---

// # PHẦN 5 — Dropdown

// ## Site practice

// [The Internet Dropdown](https://the-internet.herokuapp.com/dropdown?utm_source=chatgpt.com)

// ---

// # Native select

// ## ✅ Good

// ```ts id="g5bdj6"
// await page.locator('#dropdown')
//   .selectOption('1');
// ```

// ---

// # Verify

// ```ts id="5ab1u6"
// await expect(
//   page.locator('#dropdown')
// ).toHaveValue('1');
// ```

// ---

// # Beginner mistake

// ```ts id="6g2e0m"
// click()
// click()
// click()
// ```

// Engineer:

// > use semantic API first.

// ---

// # Nhưng production thường KHÔNG dùng native select

// React/Ant Design/MUI thường render:

// ```html id="w7c3pv"
// <div role="combobox">
// ```

// => phải:

// * click dropdown
// * wait option render
// * select text

// ---

// # Đây là lý do UI library knowledge quan trọng.

// ---

// # PHẦN 6 — File Upload

// ## Practice site

// [The Internet Upload](https://the-internet.herokuapp.com/upload?utm_source=chatgpt.com)

// ---

// # Upload file

// ```ts id="14tn3l"
// await page.setInputFiles(
//   '#file-upload',
//   'tests/fixtures/sample.pdf'
// );
// ```

// ---

// # Submit

// ```ts id="v46zb7"
// await page.getByRole('button', {
//   name: 'Upload'
// }).click();
// ```

// ---

// # Verify

// ```ts id="tup8m4"
// await expect(page.locator('#uploaded-files'))
//   .toContainText('sample.pdf');
// ```

// ---

// # Engineer mindset:

// Không verify:

// > upload button clicked

// Mà verify:

// > business outcome complete.

// ---

// # PHẦN 7 — Loading Spinner (CỰC KỲ QUAN TRỌNG)

// Đây là flaky factory.

// ---

// # Practice site

// [The Internet Dynamic Loading](https://the-internet.herokuapp.com/dynamic_loading/1?utm_source=chatgpt.com)

// ---

// # ❌ Beginner

// ```ts id="wd41iv"
// await page.click('button');

// await expect(page.locator('#finish'))
//   .toContainText('Hello World!');
// ```

// Fail random.

// ---

// # Vì sao?

// Data render delayed.

// ---

// # ✅ Better

// ```ts id="1g2bcz"
// await page.getByRole('button', {
//   name: 'Start'
// }).click();

// await expect(
//   page.locator('#finish')
// ).toContainText('Hello World!');
// ```

// ---

// # Vì sao pass?

// `expect()` retry internally.

// ---

// # Nhưng đôi lúc vẫn chưa đủ

// Production:

// * skeleton loading
// * partial render
// * websocket update
// * debounce

// ---

// # Engineer phải học:

// ## synchronization by business state

// ---

// # PHẦN 8 — Explicit Wait (khi nào dùng?)

// Rất nhiều junior abuse wait.

// ---

// # ❌ Dangerous

// ```ts id="a1m7gn"
// waitForTimeout(5000)
// ```

// Đây là:

// * arbitrary
// * slow
// * flaky
// * nondeterministic

// ---

// # Khi nào explicit wait hợp lý?

// ## Wait business signal

// Ví dụ:

// ```ts id="4zv4wu"
// await expect(spinner).toBeHidden();
// ```

// ---

// # Hoặc:

// ```ts id="1h6kqj"
// await expect(table).toContainText('John');
// ```

// ---

// # Engineer mindset:

// Không wait TIME.
// Wait STATE.

// ---

// # PHẦN 9 — Dynamic Element

// Ví dụ:

// * toast xuất hiện rồi biến mất
// * modal animation
// * delayed button enable

// ---

// # Toast example

// ```ts id="tcln1c"
// await expect(
//   page.getByRole('alert')
// ).toContainText('Saved');
// ```

// ---

// # Nhưng toast có thể disappear nhanh.

// Nên:

// * assert immediately
// * avoid delay

// ---

// # PHẦN 10 — Retryability Thinking

// Playwright retry:

// * locator
// * assertion
// * actionability

// ---

// # Nhưng test overall phải deterministic

// Ví dụ dangerous:

// ```ts id="3m5vls"
// Math.random()
// Date.now()
// shared account
// ```

// => flaky environment.

// ---

// # PHẦN 11 — Mini Real Project

// ## Scenario:

// Test registration form gồm:

// * name input
// * checkbox terms
// * dropdown country
// * upload avatar
// * submit
// * loading spinner
// * success toast

// ---

// # Yêu cầu:

// ## Validate:

// * form submit success
// * spinner disappear
// * toast visible
// * redirect success

// ---

// # Đây là production-like flow đầu tiên.

// ---

// # PHẦN 12 — Debug Synchronization

// ## Chạy:

// ```bash id="y5n0ng"
// npx playwright test --debug
// ```

// Observe:

// * spinner timing
// * delayed render
// * disabled button
// * async UI

// ---

// # Mục tiêu:

// Không đoán.
// Observe.

// ---

// # PHẦN 13 — Flaky Lab (rất quan trọng)

// ## Tạo flaky intentionally

// Ví dụ:

// ```ts id="nvv9h4"
// await page.click('button');

// await page.waitForTimeout(100);
// ```

// Rồi:

// * throttle CPU
// * headed mode
// * repeat many times

// ---

// # Quan sát:

// * random fail
// * race condition
// * timing issue

// ---

// # Đây là cách engineer học synchronization thật.

// ---

// # PHẦN 14 — Câu hỏi phỏng vấn thực chiến

// ---

// # 1. Vì sao `waitForTimeout()` nguy hiểm?

// Good answer:

// * arbitrary delay
// * nondeterministic
// * slow suite
// * hide root cause

// ---

// # 2. Khi nào Playwright auto-wait KHÔNG đủ?

// * backend async
// * business state
// * websocket
// * delayed render
// * animation/data load

// ---

// # 3. Vì sao `check()` tốt hơn `click()` cho checkbox?

// * semantic
// * built-in state handling
// * intent clearer
// * retry/actionability support

// ---

// # 4. Synchronization tốt nghĩa là gì?

// Không phải:

// > test chờ lâu

// Mà:

// > test wait đúng business state.

// ---

// # Deliverable cuối ngày

// Bạn nên có:

// ## ✅ Checkbox test

// ## ✅ Dropdown test

// ## ✅ Upload test

// ## ✅ Dynamic loading test

// ## ✅ Spinner synchronization

// ## ✅ hiểu explicit wait đúng cách

// ## ✅ bắt đầu debug flaky behavior

// ---

// # Homework tối nay

// ## 1. Chạy repeat test

// ```bash id="dphc7k"
// npx playwright test --repeat-each=20
// ```

// Quan sát flaky.

// ---

// # 2. Add artificial delay

// Chrome DevTools:

// * slow 3G
// * CPU throttle

// Quan sát synchronization issue.

// ---

// # 3. Refactor bad waits

// Tìm:

// ```ts id="v0m6ez"
// waitForTimeout
// ```

// Replace bằng:

// * expect()
// * toBeVisible()
// * toBeHidden()

// ---

// # Điều quan trọng nhất hôm nay

// Automation engineer giỏi không phải:

// > người viết test pass

// Mà là:

// > người hiểu timing, state và synchronization của system.

// Ngày 4 sẽ bắt đầu:

// * network interception
// * API mocking
// * authentication handling
// * test isolation
// * fixture architecture
// * state management

// Đây là lúc automation bắt đầu gần với software engineering thật sự.
