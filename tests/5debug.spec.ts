// // Full Production-like Playwright Test


// // npx playwright test tests/5debug.spec.ts --debug --project=chromium
// // // npx playwright test tests/5debug.spec.ts --repeat-each=10
// // npx playwright test tests/5debug.spec.ts --trace on

import { test, expect } from '@playwright/test';

test.describe('DAY 5 — Debugging Like an Automation Engineer', () => {

  // =========================================================
  // GLOBAL DEBUG OBSERVABILITY
  // =========================================================
  test.beforeEach(async ({ page }) => {

    // -------------------------------------------------------
    // REQUEST LOGGING
    // -------------------------------------------------------
    page.on('request', req => {
      console.log(
        `➡️ REQUEST: ${req.method()} ${req.url()}`
      );
    });

    // -------------------------------------------------------
    // RESPONSE LOGGING
    // -------------------------------------------------------
    page.on('response', res => {
      console.log(
        `⬅️ RESPONSE: ${res.status()} ${res.url()}`
      );
    });

    // -------------------------------------------------------
    // CONSOLE ERROR LOGGING
    // -------------------------------------------------------
    page.on('console', msg => {

      if (msg.type() === 'error') {
        console.log(
          `❌ CONSOLE ERROR: ${msg.text()}`
        );
      }

    });

    // -------------------------------------------------------
    // PAGE ERROR LOGGING
    // -------------------------------------------------------
    page.on('pageerror', error => {
      console.log(
        `🔥 PAGE CRASH: ${error.message}`
      );
    });

  });

  // =========================================================
  // TEST 1 — LOCATOR DEBUGGING
  // =========================================================
  // test('debug locator issue', async ({ page }) => {

  //   await page.goto(
  //     'https://the-internet.herokuapp.com/login'
  //   );

  //   await page.getByLabel('Username')
  //     .fill('tomsmith');

  //   await page.getByLabel('Password')
  //     .fill('SuperSecretPassword!');

  //   // -------------------------------------------------------
  //   // INTENTIONAL FAILURE
  //   // -------------------------------------------------------
  //   // Accessible name is "Login"
  //   // NOT "LOGIN"
  //   // This creates a locator mismatch
  //   // -------------------------------------------------------

  //   await page.getByRole('button', {
  //     name: 'LOGIN'
  //   }).click();

  // });

  // =========================================================
  // TEST 2 — FIXED LOCATOR
  // =========================================================
  // test('fixed locator investigation', async ({ page }) => {

  //   await page.goto(
  //     'https://the-internet.herokuapp.com/login'
  //   );

  //   await page.getByLabel('Username')
  //     .fill('tomsmith');

  //   await page.getByLabel('Password')
  //     .fill('SuperSecretPassword!');

  //   // -------------------------------------------------------
  //   // FIXED ACCESSIBLE NAME
  //   // -------------------------------------------------------

  //   const loginBtn = page.getByRole(
  //     'button',
  //     {
  //       name: 'Login'
  //     }
  //   );

  //   await expect(loginBtn)
  //     .toBeVisible();

  //   await loginBtn.click();

  //   // -------------------------------------------------------
  //   // BUSINESS ASSERTION
  //   // -------------------------------------------------------

  //   await expect(page)
  //     .toHaveURL(/secure/);

  //   await expect(page.locator('#flash'))
  //     .toContainText(
  //       'You logged into a secure area!'
  //     );

  // });

  // =========================================================
  // TEST 3 — FLAKY TEST INVESTIGATION
  // =========================================================
  // test('flaky test investigation', async ({ page }) => {

  //   await page.goto(
  //     'https://the-internet.herokuapp.com/dynamic_loading/1'
  //   );

  //   await page.getByRole('button', {
  //     name: 'Start'
  //   }).click();

  //   // -------------------------------------------------------
  //   // RACE CONDITION
  //   // -------------------------------------------------------
  //   // textContent() executes immediately
  //   // DOM may not be ready
  //   // async rendering still happening
  //   // -------------------------------------------------------

  //   await page.waitForSelector('#finish', { state: 'visible' });

  //   const text = await page.locator('#finish').textContent();
  //   expect(text?.trim()).toBe('Hello World!');   // await expect(locator).toHaveText('Hello World!');
  // });

    // AI code  thay dòng 154
    // await page.waitForFunction(() => {
      // const el = document.querySelector('#finish');
      // return el?.textContent?.includes('Hello World!');});  // return el?.textContent?.trim() ==='Hello World!';});

          // AI cách khác
    // const text = await page.locator('#finish').innerText();
    // expect(text).toBe('Hello World!');

    // --------
  //   expect(text)
  // .toMatch(/Hello World!/);
  // expect(text)
  // .toMatch(/\s*Hello World!\s*/);




  // =========================================================
  // TEST 4 — FIXED RACE CONDITION
  // =========================================================
  // test('state-driven synchronization', async ({ page }) => {

  //   await page.goto(
  //     'https://the-internet.herokuapp.com/dynamic_loading/1'
  //   );

  //   await page.getByRole('button', {
  //     name: 'Start'
  //   }).click();

  //   // -------------------------------------------------------
  //   // STATE-DRIVEN ASSERTION
  //   // -------------------------------------------------------

  //   await expect(
  //     page.locator('#finish')
  //   ).toHaveText('Hello World!');

  // });

  // =========================================================
  // TEST 5 — BAD WAIT VS GOOD WAIT
  // =========================================================
  // test('hard wait anti-pattern', async ({ page }) => {

  //   await page.goto(
  //     'https://the-internet.herokuapp.com/dynamic_loading/2'
  //   );

  //   await page.getByRole('button', {
  //     name: 'Start'
  //   }).click();

  //   // -------------------------------------------------------
  //   // BAD PRACTICE
  //   // -------------------------------------------------------

  //   // await page.waitForTimeout(5000);

  //   // WHY BAD?
  //   // - machine dependent
  //   // - CI timing different
  //   // - nondeterministic
  //   // - slower suite

  //   // -------------------------------------------------------
  //   // GOOD PRACTICE
  //   // -------------------------------------------------------

  //   await expect(
  //     page.locator('#finish')
  //   ).toContainText('Hello World!',{
  //     timeout: 10000
  //   });

  // });

  // =========================================================
  // TEST 6 — NETWORK SYNCHRONIZATION
  // =========================================================
  test('network + navigation debugging', async ({ page }) => {

  page.on('request', req => {
    console.log(
      '➡️',
      req.method(),
      req.url()
    );
  });

  page.on('response', res => {
    console.log(
      '⬅️',
      res.status(),
      res.url()
    );
  });

  await page.goto(
    'https://the-internet.herokuapp.com/login'
  );

  await page.getByLabel('Username')
    .fill('tomsmith');

  await page.getByLabel('Password')
    .fill('SuperSecretPassword!');

  await Promise.all([

    // ------------ AI nhưng ko chạy dc
  //     page.waitForResponse(resp =>
  //   resp.url().includes('/api/orders')
  //   && resp.status() === 200
  // ),
  // page.getByRole('button',{name: 'login'}).click()
//----------- page.getbyrole('button', )

    // Observe navigation dependency
    page.waitForURL(/secure/),

    page.getByRole('button', {
      name: 'Login'
    }).click()

  ]);

  // Business state assertion
  await expect(page.locator('#flash'))
    .toContainText(
      'You logged into a secure area!'
    );

});

  // =========================================================
  // TEST 7 — CHECKBOX STATE DEBUGGING
  // =========================================================
  test('checkbox deterministic debugging', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/checkboxes'
    );

    const checkbox = page
      .locator('input[type="checkbox"]')
      .first();

    // -------------------------------------------------------
    // BAD
    // -------------------------------------------------------
    // click() toggles unknown state

    // await checkbox.click();

    // -------------------------------------------------------
    // GOOD
    // -------------------------------------------------------

    await checkbox.check();

    await expect(checkbox)
      .toBeChecked();

  });

  // =========================================================
  // TEST 8 — FILE UPLOAD DEBUGGING
  // =========================================================
  test('file upload debugging', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/upload'
    );

    // -------------------------------------------------------
    // MEMORY-BASED FILE
    // -------------------------------------------------------
    // deterministic
    // CI-safe
    // no filesystem dependency
    // -------------------------------------------------------

    await page.setInputFiles(
      '#file-upload',
      {
        name: 'avatar.png',
        mimeType: 'image/png',
        buffer: Buffer.from('fake image')
      }
    );

    await page.getByRole('button', {
      name: 'Upload'
    }).click();

    await expect(page.locator('h3'))
      .toHaveText('File Uploaded!');

  });

  // =========================================================
  // TEST 9 — OBSERVABILITY ENGINEERING
  // =========================================================
  test('meaningful assertion debugging', async ({ page }) => {

    await page.goto(
      'https://the-internet.herokuapp.com/login'
    );

    await page.getByLabel('Username')
      .fill('wrong-user');

    await page.getByLabel('Password')
      .fill('wrong-password');

    await page.getByRole('button', {
      name: 'Login'
    }).click();

    // -------------------------------------------------------
    // GOOD FAILURE MESSAGE
    // -------------------------------------------------------

    await expect(page.locator('#flash'))
      .toContainText(
        'Your username is invalid!'
      );

  });

});



// # WEEK 1 — DAY 5

// # Debugging Like an Automation Engineer

// Đây là ngày bắt đầu chuyển từ:

// ```text id="rzn9sl"
// người viết test
// ```

// thành:

// ```text id="h7dwru"
// người điều tra system behavior
// ```

// ---

// # 🎯 Goal hôm nay

// Sau Day 5 bạn phải hiểu:

// * debugging automation KHÔNG phải đoán mò
// * flaky test cần root-cause analysis
// * cách đọc trace như engineer
// * cách đọc timing issue
// * cách debug locator/state/network
// * tại sao rerun không phải fix
// * observability quan trọng thế nào

// ---

// # Hôm nay bạn sẽ học

// | Chủ đề             | Ý nghĩa thật          |
// | ------------------ | --------------------- |
// | Trace Viewer       | failure investigation |
// | PWDEBUG            | interactive debugging |
// | Call logs          | action analysis       |
// | Network debugging  | async dependency      |
// | Flaky root cause   | system timing         |
// | Observability      | debugging quality     |
// | Rerun anti-pattern | fake stability        |

// ---

// # PHẦN 1 — Automation debugging KHÔNG phải đoán

// # Người mới debug kiểu:

// ```text id="g7e0ic"
// thêm sleep
// rerun thử
// đổi timeout
// hy vọng pass
// ```

// ---

// # Engineer debug kiểu:

// ```text id="3i6n4n"
// quan sát state
// đọc trace
// xác định timing
// phân tích root cause
// ```

// ---

// # Đây là khác biệt cực lớn.

// ---

// # PHẦN 2 — Trace Viewer là vũ khí mạnh nhất

// # Đây là tool quan trọng nhất của Playwright

// Run:

// ```bash id="1k3u8p"
// npx playwright test --trace on
// ```

// Sau đó:

// ```bash id="uj5b8n"
// npx playwright show-report
// ```

// Mở trace.

// ---

// # Trace cho bạn thấy:

// ## 1. Timeline

// * từng action
// * timing thật
// * execution order

// ---

// ## 2. DOM snapshot

// Bạn thấy:

// * UI state tại từng step
// * element tồn tại hay chưa
// * loading state

// ---

// ## 3. Network

// * request
// * response
// * timing
// * status code

// ---

// ## 4. Console errors

// * JS error
// * frontend crash
// * warning

// ---

// ## 5. Screenshots/video

// * visual state
// * overlay
// * hidden element

// ---

// # Đây là:

// # Black box recorder của automation

// ---

// # PHẦN 3 — Debugging mindset

// # Khi test fail

// KHÔNG hỏi:

// ```text id="f6jdu8"
// làm sao để pass?
// ```

// Hỏi:

// ```text id="g1h9xr"
// root cause là gì?
// ```

// ---

// # Đây là mindset rất quan trọng.

// ---

// # PHẦN 4 — PWDEBUG mode

// Run:

// ```bash id="1q5nqt"
// npx playwright test --debug
// ```

// ---

// # Bạn sẽ có:

// * step-by-step execution
// * locator picker
// * actionability log
// * pause/resume
// * live DOM inspection

// ---

// # Đây KHÔNG phải:

// ```text id="jlwm8v"
// chạy browser cho vui
// ```

// ---

// # Đây là:

// # Interactive system investigation

// ---

// # Exercise 1 — Debug locator issue

// Tạo file:

// ```text id="jlwm6k"
// tests/day5-debug.spec.ts
// ```

// Code:

// ```ts id="jlwm7w"
// import { test, expect } from '@playwright/test';

// test('debug locator issue', async ({ page }) => {
//   await page.goto(
//     'https://the-internet.herokuapp.com/login'
//   );

//   await page.getByLabel('Username').fill('tomsmith');

//   await page.getByLabel('Password').fill(
//     'SuperSecretPassword!'
//   );

//   await page.getByRole('button', {
//     name: 'LOGIN'
//   }).click();
// });
// ```

// ---

// # 🎯 Task

// Test sẽ fail.

// Debug:

// * accessible name thật là gì?
// * locator mismatch ở đâu?
// * trace/call log nói gì?

// ---

// # Đây là debugging thật.

// Không phải:

// ```text id="jlwm2q"
// đổi random locator tới khi pass
// ```

// ---

// # PHẦN 5 — Call log analysis

// # Playwright call log cực mạnh

// Ví dụ error:

// ```text id="jlwm8n"
// waiting for getByRole('button', { name: 'LOGIN' })
// ```

// ---

// # Đây là clue cực quan trọng

// Bạn phải đọc:

// * Playwright đang đợi gì?
// * condition nào chưa satisfied?
// * locator resolve được chưa?

// ---

// # Engineer đọc error message như forensic data.

// ---

// # PHẦN 6 — Flaky test investigation workflow

// # Khi test flaky

// Phải investigate theo thứ tự:

// ---

// # 1. Timing issue?

// * rendering
// * async data
// * animation
// * loading

// ---

// # 2. Locator issue?

// * fragile selector
// * dynamic DOM
// * wrong accessible name

// ---

// # 3. State issue?

// * dirty data
// * reused account
// * cross-test pollution

// ---

// # 4. Network issue?

// * API slow
// * response fail
// * timeout

// ---

// # 5. Environment issue?

// * CI slower
// * headless rendering
// * parallel collision

// ---

// # Đây là workflow thật trong team automation.

// ---

// # PHẦN 7 — Rerun anti-pattern

// # Người mới:

// ```text id="jlwm6n"
// rerun pass rồi => okay
// ```

// ---

// # Engineer:

// ```text id="jlwm2w"
// nếu rerun fix được
// => test đang nondeterministic
// ```

// ---

// # Retry chỉ:

// * mask symptom
// * hide flaky
// * create fake confidence

// ---

// # Retry KHÔNG fix root cause.

// ---

// # PHẦN 8 — Observability engineering

// # Automation tốt phải dễ debug

// # Bad failure

// ```text id="jlwm4w"
// Expected true to be true
// ```

// ---

// # Better

// ```text id="jlwm8b"
// Expected order-status to have text "Completed"
// Received "Pending"
// ```

// ---

// # Observability gồm:

// ✅ meaningful assertion
// ✅ readable locator
// ✅ trace enabled
// ✅ screenshots
// ✅ logs
// ✅ business-readable test names

// ---

// # Đây là maintainability engineering.

// ---

// # PHẦN 9 — Network debugging

// # Modern UI = network dependent

// Khi flaky:

// * check API timing
// * check failed response
// * check status code

// ---

// # Example

// ```ts id="jlwm4r"
// await Promise.all([
//   page.waitForResponse(resp =>
//     resp.url().includes('/api/orders')
//     && resp.status() === 200
//   ),

//   page.getByRole('button', {
//     name: 'Submit'
//   }).click()
// ]);
// ```

// ---

// # Đây là:

// # Event synchronization

// Không phải:

// ```text id="jlwm0b"
// sleep synchronization
// ```

// ---

// # PHẦN 10 — Root-cause mindset

// # Sai mindset

// ```text id="jlwm4c"
// test fail
// => thêm timeout
// ```

// ---

// # Đúng mindset

// ```text id="jlwm5c"
// test fail
// => system state nào chưa stable?
// ```

// ---

// # Đây là core của automation engineering.

// ---

// # Exercise 2 — Investigate flaky test

// Code:

// ```ts id="jlwm0n"
// test('flaky test investigation', async ({ page }) => {
//   await page.goto(
//     'https://the-internet.herokuapp.com/dynamic_loading/1'
//   );

//   await page.getByRole('button', {
//     name: 'Start'
//   }).click();

//   const text = await page.locator('#finish')
//     .textContent();

//   expect(text).toBe('Hello World!');
// });
// ```

// ---

// # 🎯 Task

// Run nhiều lần.

// Sau đó investigate:

// * timing
// * DOM snapshot
// * retry absence
// * race condition

// ---

// # Refactor

// ```ts id="jlwm4u"
// await expect(page.locator('#finish'))
//   .toHaveText('Hello World!');
// ```

// ---

// # PHẦN 11 — CI debugging mindset

// # CI fail thường khó hơn local

// Vì:

// * không reproduce được
// * timing khác
// * machine khác
// * no UI

// ---

// # Đây là lý do:

// * trace
// * screenshot
// * logs
// * video

// rất quan trọng.

// ---

// # Automation framework tốt phải:

// ```text id="jlwm6b"
// collect enough debugging evidence
// ```

// ---

// # TASKS HÔM NAY

// # Task 1

// Bật:

// ```bash id="jlwm6d"
// --trace on
// ```

// ---

// # Task 2

// Mở trace và đọc:

// * timeline
// * DOM snapshot
// * network

// ---

// # Task 3

// Dùng:

// ```bash id="jlwm0r"
// --debug
// ```

// Debug locator failure.

// ---

// # Task 4

// Tạo flaky test cố ý.

// Investigate root cause.

// ---

// # Task 5

// Refactor:

// * snapshot assertion
// * hard wait
// * weak locator

// ---

// # Task 6

// Viết note:

// ```text id="jlwm8z"
// Tại sao rerun không phải fix thật?
// ```

// ---

// # INTERVIEW TRAINING

// # 1. Bạn debug flaky test như thế nào?

// Điểm cần nói:

// * trace viewer
// * timing analysis
// * locator analysis
// * network inspection
// * state synchronization

// ---

// # 2. Tại sao rerun không phải solution tốt?

// Điểm cần nói:

// * hide flaky
// * nondeterministic test
// * fake confidence
// * unstable regression

// ---

// # 3. Trace Viewer giúp gì?

// Điểm cần nói:

// * DOM snapshot
// * timeline
// * network
// * debugging evidence
// * reproduce CI failure

// ---

// # 4. Tại sao observability quan trọng?

// Điểm cần nói:

// * easier debugging
// * faster root-cause analysis
// * maintainability
// * readable CI failures

// ---

// # Kết thúc Week 1

// Nếu sau tuần này bạn chỉ biết:

// ```text id="jlwm8y"
// Playwright syntax
// ```

// => bạn vẫn là người “script automation”.

// ---

// # Nhưng nếu bạn bắt đầu hiểu:

// ```text id="jlwm7v"
// timing
// synchronization
// determinism
// debugging
// observability
// ```

// => bạn đang bắt đầu chuyển sang mindset:

// # Automation Engineer thật.
