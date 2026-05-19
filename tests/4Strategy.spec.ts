// Full Production-like Playwright Test
// 1 Playwright auto-wait
// https://www.youtube.com/@playwrightdev?utm_source=chatgpt.com
// https://www.youtube.com/@testerstalk?utm_source=chatgpt.com

// 2 waiting strategies
// https://www.youtube.com/@MinistryoftestingOfficial?utm_source=chatgpt.com
// https://www.youtube.com/@AutomationStepByStep?utm_source=chatgpt.com

// 3 flaky test root cause
// https://www.youtube.com/@ExecuteAutomation?utm_source=chatgpt.com
// https://www.youtube.com/@LambdaTestInc?utm_source=chatgpt.com

// 4 async JavaScript internals
// https://www.youtube.com/@Fireship?utm_source=chatgpt.com
// https://www.youtube.com/@WebDevSimplified?utm_source=chatgpt.com

// 5 production framework architecture
// https://www.youtube.com/@checklyhq?utm_source=chatgpt.com
// https://www.youtube.com/@playwrightdev?utm_source=chatgpt.com

// Flaky test thường là synchronization problem,
// không phải Playwright problem.


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

//     Spinner KHÔNG bị remove khỏi DOM
// Nó chỉ đổi style kiểu:
// display: none
// hoặc animation state.
    //await expect(spinner).toBeHidden();

    //Final stable state
    // const resultText = page.locator('#finish h4');
    // //await expect(resultText).toBeVisible();
    // await expect(resultText).toHaveText('Hello World!');

    await expect(
    page.locator('#finish')
    ).toContainText('Hello World!', {
    timeout: 10000
    });
// await expect(
//   page.getByText('Hello World!')
// ).toBeVisible();

 
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

    // await expect(
    //   page.getByRole('heading', {
    //     name: 'Secure Area',
    //     exact: true
    //   })
    // ).toBeVisible();
    // // Option 3 — first()
    // page.getByRole('heading', {
    // name: 'Secure Area'
    // }).first()
   
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










// # WEEK 1 — DAY 4

// # Waiting Strategy + Async Reality + Flaky Root Cause

// Hôm nay là ngày bắt đầu “đụng thế giới thật”.

// Đa số automation fail KHÔNG phải vì:

// * syntax
// * Playwright bug
// * browser issue

// Mà vì:

// ```text id="dr53wo"
// engineer không hiểu async behavior của web app
// ```

// ---

// # 🎯 Goal hôm nay

// Sau Day 4 bạn phải hiểu:

// * browser không synchronous
// * UI rendering có lifecycle
// * loading state ảnh hưởng test thế nào
// * tại sao hard wait nguy hiểm
// * thế nào là state-driven waiting
// * tại sao race condition gây flaky
// * cách debug synchronization issue

// ---

// # Hôm nay bạn sẽ học

// | Chủ đề                | Ý nghĩa thật                |
// | --------------------- | --------------------------- |
// | Async rendering       | UI timing reality           |
// | Waiting strategy      | synchronization engineering |
// | Race condition        | flaky root cause            |
// | Loading states        | deterministic testing       |
// | Auto-wait limitations | engineer responsibility     |
// | State-driven waits    | production stability        |

// ---

// # PHẦN 1 — Browser automation là synchronization engineering

// # Đây là mindset quan trọng nhất hôm nay

// Người mới nghĩ:

// ```text id="6x4f7u"
// automation = click + assert
// ```

// Engineer nghĩ:

// ```text id="x6k44m"
// automation = synchronize với system state
// ```

// ---

// # Modern web app flow thật sự

// ```text id="c0g0su"
// click
// → JS event
// → API request
// → loading spinner
// → backend processing
// → response
// → state update
// → re-render
// → animation
// → DOM stable
// ```

// ---

// # Nếu test chạy nhanh hơn app?

// => race condition.

// ---

// # Đây là nguồn flaky lớn nhất.

// ---

// # PHẦN 2 — Auto-wait KHÔNG phải magic

// # Sai lầm phổ biến

// Người mới nghĩ:

// ```text id="5z0v9z"
// Playwright auto-wait nên không cần hiểu timing
// ```

// Sai.

// ---

// # Playwright auto-wait cho:

// ✅ visibility
// ✅ enabled
// ✅ stable element
// ✅ attached DOM

// ---

// # Nhưng KHÔNG hiểu:

// ❌ business state
// ❌ API completed?
// ❌ spinner disappeared?
// ❌ backend processed?
// ❌ data synchronized?

// ---

// # Đây là engineer responsibility.

// ---

// # Example

// ```ts id="r6c6ev"
// await page.getByRole('button', {
//   name: 'Save'
// }).click();
// ```

// Playwright chỉ đảm bảo:

// ```text id="y2q3m4"
// button click được
// ```

// KHÔNG đảm bảo:

// ```text id="h6a6rl"
// save operation hoàn tất
// ```

// ---

// # PHẦN 3 — Hard wait là “timing gamble”

// # Bad

// ```ts id="yjlwm4"
// await page.waitForTimeout(5000);
// ```

// ---

// # Đây là gì?

// Không phải synchronization.

// Đây là:

// ```text id="1m4fd3"
// hy vọng app xong trong 5 giây
// ```

// ---

// # Tại sao local pass?

// Máy local:

// * nhanh
// * network tốt
// * ít contention

// ---

// # Tại sao CI fail?

// CI:

// * shared CPU
// * headless
// * slower rendering
// * slower network

// 5s local:

// ```text id="8fttq5"
// đủ
// ```

// 5s CI:

// ```text id="njlwm9"
// không đủ
// ```

// => flaky.

// ---

// # Engineering mindset

// Không hỏi:

// ```text id="jlwm5w"
// đợi bao lâu?
// ```

// Hỏi:

// ```text id="jlwm8m"
// đợi state gì?
// ```

// ---

// # PHẦN 4 — State-driven waiting

// # Đây là automation mindset đúng

// # Bad

// ```ts id="jlwm2m"
// await page.click('.submit');

// await page.waitForTimeout(3000);
// ```

// ---

// # Better

// ```ts id="jlwm2k"
// await page.getByRole('button', {
//   name: 'Submit'
// }).click();

// await expect(page.getByTestId('success-message'))
//   .toBeVisible();
// ```

// ---

// # Khác biệt lớn

// ## Hard wait

// Wait theo:

// ```text id="jlwm7y"
// time assumption
// ```

// ---

// ## Smart wait

// Wait theo:

// ```text id="jlwm0w"
// observable state
// ```

// ---

// # Đây là deterministic testing.

// ---

// # PHẦN 5 — Loading spinner problem

// # Đây là case rất thực tế

// App flow:

// ```text id="jlwm0l"
// click login
// → spinner xuất hiện
// → API request
// → spinner biến mất
// → dashboard render
// ```

// ---

// # Người mới thường:

// ```ts id="jlwm9x"
// await page.click('.login');

// await page.waitForTimeout(5000);
// ```

// ---

// # Engineer:

// ```ts id="jlwm7n"
// await page.getByRole('button', {
//   name: 'Login'
// }).click();

// await expect(page.getByTestId('loading'))
//   .toBeHidden();

// await expect(page.getByRole('heading', {
//   name: 'Dashboard'
// })).toBeVisible();
// ```

// ---

// # Tại sao tốt hơn?

// Test synchronize với:

// * actual state
// * actual loading lifecycle

// ---

// # Exercise 1 — Dynamic loading

// Tạo file:

// ```text id="jlwm1n"
// tests/day4-loading.spec.ts
// ```

// Code:

// ```ts id="jlwm7f"
// import { test, expect } from '@playwright/test';

// test('handle loading state properly', async ({ page }) => {
//   await page.goto(
//     'https://the-internet.herokuapp.com/dynamic_loading/2'
//   );

//   await page.getByRole('button', {
//     name: 'Start'
//   }).click();

//   await expect(page.locator('#loading'))
//     .toBeHidden();

//   await expect(page.locator('#finish'))
//     .toHaveText('Hello World!');
// });
// ```

// ---

// # 🎯 Observe

// * spinner lifecycle
// * retry assertion
// * synchronization behavior

// ---

// # PHẦN 6 — Race condition là gì?

// # Đây là thứ giết automation nhiều nhất

// # Example

// ```ts id="jlwm6h"
// await page.click('.save');

// await expect(page.locator('.status'))
//   .toHaveText('Saved');
// ```

// ---

// # Problem

// UI update chưa kịp.

// Test check quá sớm.

// ---

// # Đây là:

// # Race condition

// Test và app “đua timing”.

// ---

// # Race condition thường random:

// ```text id="jlwm9j"
// pass local
// fail CI
// pass rerun
// fail random
// ```

// ---

// # Đây là dấu hiệu rất quan trọng.

// ---

// # PHẦN 7 — Auto-wait limitations

// # Playwright KHÔNG đọc mind app

// Nó không biết:

// * API business completed?
// * websocket finished?
// * animation meaningful?
// * data consistency done?

// ---

// # Engineer phải identify:

// # “observable stable state”

// ---

// # Ví dụ tốt

// ```ts id="jlwm6r"
// await expect(page.getByTestId('order-status'))
//   .toHaveText('Completed');
// ```

// ---

// # Ví dụ yếu

// ```ts id="jlwm6t"
// await page.waitForTimeout(10000);
// ```

// ---

// # Một cái verify:

// ```text id="jlwm5i"
// actual business state
// ```

// Một cái:

// ```text id="jlwm1z"
// timing assumption
// ```

// ---

// # PHẦN 8 — Network-aware testing

// # Thực tế production

// UI thường phụ thuộc:

// * API
// * async processing
// * delayed response

// ---

// # Có lúc cần synchronize với network

// Ví dụ:

// ```ts id="jlwm0v"
// await Promise.all([
//   page.waitForResponse(resp =>
//     resp.url().includes('/orders')
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

// Không phải time synchronization.

// ---

// # PHẦN 9 — Debugging synchronization issue

// # Khi test flaky

// KHÔNG được:

// ```text id="jlwm9v"
// tăng timeout vô hạn
// ```

// ---

// # Phải debug:

// ## 1. State nào chưa stable?

// ## 2. UI render chưa xong?

// ## 3. Spinner còn tồn tại?

// ## 4. API chưa completed?

// ## 5. Animation overlap?

// ## 6. Wrong assumption?

// ---

// # Đây là automation engineering thật.

// ---

// # Exercise 2 — Tạo flaky timing test

// Code BAD:

// ```ts id="jlwm8c"
// test('flaky timing example', async ({ page }) => {
//   await page.goto(
//     'https://the-internet.herokuapp.com/dynamic_loading/2'
//   );

//   await page.getByRole('button', {
//     name: 'Start'
//   }).click();

//   const text = await page.locator('#finish').textContent();

//   expect(text).toBe('Hello World!');
// });
// ```

// ---

// # 🎯 Task

// Run nhiều lần.

// Quan sát:

// * random failure
// * timing race

// ---

// # Refactor

// ```ts id="jlwm6u"
// await expect(page.locator('#finish'))
//   .toHaveText('Hello World!');
// ```

// ---

// # PHẦN 10 — CI mindset

// # Tại sao synchronization issue lộ mạnh ở CI?

// CI:

// * CPU yếu hơn
// * rendering chậm
// * network variance
// * parallel execution
// * shared environment

// ---

// # Timing assumption local thường sụp ở CI.

// ---

// # Đây là lý do:

// * hard wait
// * snapshot assertion
// * fragile synchronization

// rất nguy hiểm.

// ---

// # TASKS HÔM NAY

// # Task 1

// Viết:

// * hard wait version
// * state-driven version

// So sánh stability.

// ---

// # Task 2

// Handle loading spinner đúng cách.

// ---

// # Task 3

// Tạo flaky timing test cố ý.

// ---

// # Task 4

// Debug bằng:

// * trace
// * debug mode
// * call log

// ---

// # Task 5

// Viết note:

// ```text id="jlwm2c"
// Tại sao synchronization engineering quan trọng hơn syntax?
// ```

// ---

// # INTERVIEW TRAINING

// # 1. Tại sao hard wait nguy hiểm?

// Điểm cần nói:

// * timing assumption
// * flaky CI
// * slow execution
// * non-deterministic

// ---

// # 2. Race condition là gì?

// Điểm cần nói:

// * timing competition
// * async rendering
// * unstable execution
// * random failure

// ---

// # 3. Tại sao auto-wait chưa đủ?

// Điểm cần nói:

// * Playwright không hiểu business state
// * không biết API completed
// * không biết loading lifecycle

// ---

// # 4. State-driven waiting là gì?

// Điểm cần nói:

// * wait actual observable state
// * deterministic synchronization
// * stable automation

// ---

// # Kết thúc Day 4

// Nếu hôm nay bạn chỉ học:

// ```text id="jlwm1v"
// wait strategy
// ```

// => chưa đủ.

// Nếu hôm nay bạn hiểu:

// ```text id="jlwm0y"
// automation = synchronization engineering
// ```

// và:

// ```text id="jlwm4m"
// flaky test thường là race condition
// ```

// => bạn đang bắt đầu nghĩ như automation engineer thật.
