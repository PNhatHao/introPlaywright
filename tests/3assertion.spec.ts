// Full Production-like Playwright Test
//  https://www.youtube.com/results?search_query=playwright+assertions+auto+waiting
//  https://www.youtube.com/results?search_query=playwright+flaky+tests+retry+strategy
// https://www.youtube.com/results?search_query=playwright+best+practices+e2e+testing
// https://www.youtube.com/results?search_query=why+playwright+tests+are+flaky
// https://www.youtube.com/results?search_query=playwright+web+first+assertions+explained
 

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


// npx playwright test tests/3assertion.spec.ts --debug --project=chromium
// // npx playwright test tests/3assertion.spec.ts --repeat-each=10









// # WEEK 1 — DAY 3

// # Assertion Engineering + Deterministic Testing

// Hôm nay là ngày cực kỳ quan trọng.

// Đây là chỗ nhiều automation test bắt đầu:

// ```text
// PASS local
// FAIL random
// FAIL CI
// ```

// Nguyên nhân thường KHÔNG phải Playwright.

// Mà là:

// * assertion yếu
// * synchronization sai
// * assumption sai về timing
// * test verify sai abstraction level

// ---

// # 🎯 Goal hôm nay

// Sau Day 3 bạn phải hiểu:

// * assertion không chỉ để “check”
// * assertion còn synchronize flow
// * tại sao snapshot assertion flaky
// * tại sao eventual consistency gây fail random
// * thế nào là deterministic testing
// * tại sao assertion yếu gây false confidence

// ---

// # Hôm nay bạn sẽ học

// | Chủ đề                | Ý nghĩa thật    |
// | --------------------- | --------------- |
// | Retryable assertions  | synchronization |
// | Snapshot assertions   | race conditions |
// | Eventual consistency  | async reality   |
// | Assertion scope       | maintainability |
// | Weak assertions       | fake confidence |
// | Deterministic testing | CI reliability  |

// ---

// # PHẦN 1 — Assertion không chỉ là verification

// # Người mới nghĩ:

// ```text
// assertion = check expected result
// ```

// Engineer nghĩ:

// ```text
// assertion = synchronization + validation
// ```

// ---

// # Đây là khác biệt rất lớn

// Ví dụ:

// ```ts id="ax7m1d"
// await expect(page.getByText('Success'))
//   .toBeVisible();
// ```

// Playwright sẽ:

// * retry
// * polling
// * wait rendering
// * wait visibility
// * synchronize UI state

// ---

// # Assertion đang làm:

// ## 1. Validation

// Verify business outcome.

// ---

// ## 2. Synchronization

// Đợi UI state đúng.

// ---

// # Đây là lý do retry assertion cực mạnh.

// ---

// # PHẦN 2 — Snapshot assertion là nguồn flaky lớn

// # Bad

// ```ts id="z2mc9q"
// const text = await page.locator('.message').textContent();

// expect(text).toBe('Success');
// ```

// ---

// # Tại sao nguy hiểm?

// `textContent()` đọc DOM ngay lập tức.

// KHÔNG retry.

// ---

// # Nếu app:

// * render chậm
// * animation
// * API delay
// * hydration delay

// => flaky.

// ---

// # Đây là:

// # Snapshot assertion

// Bạn chụp state tại 1 thời điểm.

// ---

// # Better

// ```ts id="1lh0xk"
// await expect(page.locator('.message'))
//   .toHaveText('Success');
// ```

// ---

// # Tại sao mạnh hơn?

// Playwright sẽ:

// * polling
// * retry
// * wait until stable
// * timeout properly

// ---

// # Engineering mindset

// Đừng verify:

// ```text
// instant state
// ```

// Hãy verify:

// ```text
// eventual expected state
// ```

// ---

// # PHẦN 3 — Eventual Consistency

// # Đây là concept cực quan trọng trong automation

// Modern web app KHÔNG synchronous.

// UI thường:

// ```text
// click
// → API request
// → loading
// → render
// → animation
// → state update
// ```

// ---

// # Nếu assertion xảy ra quá sớm:

// => race condition.

// ---

// # Đây là lý do test local pass nhưng CI fail.

// CI chậm hơn:

// * network
// * rendering
// * CPU
// * headless timing

// ---

// # Exercise 1 — Quan sát retry assertion

// Tạo file:

// ```text
// tests/day3-assertion-retry.spec.ts
// ```

// Code:

// ```ts id="2j0mws"
// import { test, expect } from '@playwright/test';

// test('retry assertion demo', async ({ page }) => {
//   await page.goto(
//     'https://the-internet.herokuapp.com/dynamic_loading/1'
//   );

//   await page.getByRole('button', {
//     name: 'Start'
//   }).click();

//   await expect(page.locator('#finish'))
//     .toHaveText('Hello World!');
// });
// ```

// ---

// # 🎯 Observe

// Playwright KHÔNG fail ngay.

// Nó:

// * polling
// * retry
// * synchronize

// ---

// # Đây là deterministic waiting.

// ---

// # PHẦN 4 — Weak assertion tạo false confidence

// # Bad assertion

// ```ts id="jlwmr5"
// expect(true).toBeTruthy();
// ```

// ---

// # Hoặc:

// ```ts id="jlwmv7"
// await expect(page.locator('.success'))
//   .toBeVisible();
// ```

// ---

// # Tại sao yếu?

// Visible KHÔNG nghĩa:

// * đúng business logic
// * đúng data
// * đúng transaction
// * đúng workflow

// ---

// # Ví dụ thực tế

// UI show:

// ```text
// Payment Successful
// ```

// Nhưng:

// * amount sai
// * transaction duplicated
// * API fail silently

// Test vẫn pass.

// ---

// # Đây gọi là:

// # False positive automation

// Cực nguy hiểm.

// ---

// # Engineer mindset

// Assertion phải verify:

// ```text
// business-critical outcome
// ```

// không chỉ:

// ```text
// element visible
// ```

// ---

// # Better assertion

// ```ts id="jlwmc9"
// await expect(page.getByTestId('payment-status'))
//   .toHaveText('Payment Successful');

// await expect(page.getByTestId('payment-amount'))
//   .toHaveText('$100');
// ```

// ---

// # PHẦN 5 — Assertion scope

// # Người mới thường over-assert

// Ví dụ:

// ```ts id="jlwmj2"
// await expect(page.locator('body'))
//   .toContainText('Dashboard');
// ```

// ---

// # Tại sao tệ?

// * vague
// * broad
// * hard debug
// * dễ false positive

// ---

// # Better

// ```ts id="5jz4qp"
// await expect(page.getByRole('heading', {
//   name: 'Dashboard'
// })).toBeVisible();
// ```

// ---

// # Principle

// Assertion càng precise:

// * càng stable
// * càng readable
// * càng dễ debug

// ---

// # PHẦN 6 — Assertions nên readable như business rule

// # Bad

// ```ts id="jlwm1s"
// expect(await locator.textContent())
//   .toBe('Success')
// ```

// ---

// # Better

// ```ts id="jlwm8u"
// await expect(page.getByTestId('order-status'))
//   .toHaveText('Completed');
// ```

// ---

// # Tại sao?

// CI report sẽ readable hơn:

// ```text
// Expected order-status to have text "Completed"
// ```

// ---

// # Đây là:

// # Observability quality

// Automation tốt phải:

// * fail readable
// * easy debug
// * meaningful report

// ---

// # PHẦN 7 — Hard wait vs assertion retry

// # Bad

// ```ts id="jlwm3m"
// await page.click('.submit');

// await page.waitForTimeout(5000);

// expect(await page.locator('.success').textContent())
//   .toBe('Done');
// ```

// ---

// # Problems

// * assume timing
// * slow regression
// * flaky CI
// * snapshot assertion

// ---

// # Better

// ```ts id="jlwm2x"
// await page.getByRole('button', {
//   name: 'Submit'
// }).click();

// await expect(page.getByTestId('status'))
//   .toHaveText('Done');
// ```

// ---

// # Đây là:

// # State-driven testing

// Không wait theo time.
// Wait theo state.

// ---

// # PHẦN 8 — Debugging flaky assertions

// # Khi assertion fail

// KHÔNG được nghĩ ngay:

// ```text
// Playwright flaky
// ```

// ---

// # Phải phân tích:

// ## 1. UI render chưa xong?

// ## 2. API response chậm?

// ## 3. Wrong locator?

// ## 4. Dynamic content?

// ## 5. Animation?

// ## 6. Race condition?

// ## 7. Wrong business assumption?

// ---

// # Exercise 2 — Tạo flaky test cố ý

// Code:

// ```ts id="jlwm5n"
// test('flaky example', async ({ page }) => {
//   await page.goto(
//     'https://the-internet.herokuapp.com/dynamic_loading/1'
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

// * fail random
// * timing issue

// ---

// # Sau đó refactor:

// ```ts id="jlwm0p"
// await expect(page.locator('#finish'))
//   .toHaveText('Hello World!');
// ```

// ---

// # PHẦN 9 — Deterministic testing

// # Đây là goal thật sự của automation

// Test tốt phải:

// ```text
// same input
// same environment
// same result
// ```

// ---

// # Nếu test:

// * pass random
// * fail random
// * timing sensitive

// => regression system không đáng tin.

// ---

// # Deterministic test cần:

// ✅ stable locator
// ✅ retry assertion
// ✅ state synchronization
// ✅ isolated data
// ✅ no hard wait

// ---

// # PHẦN 10 — CI mindset

// # Tại sao assertion fail CI nhiều hơn local?

// CI:

// * slower rendering
// * slower API
// * parallel execution
// * no GPU
// * different timing

// ---

// # Snapshot assertion sẽ lộ flaw rất nhanh.

// ---

// # TASKS HÔM NAY

// # Task 1

// Viết:

// * snapshot assertion
// * retry assertion

// So sánh stability.

// ---

// # Task 2

// Tạo flaky test cố ý.

// ---

// # Task 3

// Refactor:

// * hard wait
// * weak assertion
// * broad assertion

// ---

// # Task 4

// Dùng:

// ```bash
// --debug
// ```

// Quan sát assertion retry.

// ---

// # Task 5

// Viết note:

// ```text
// Tại sao assertion retry giúp deterministic testing?
// ```

// ---

// # INTERVIEW TRAINING

// # 1. Tại sao snapshot assertion flaky?

// Điểm cần nói:

// * no retry
// * async rendering
// * race condition
// * timing sensitive

// ---

// # 2. Tại sao retry assertion mạnh hơn?

// Điểm cần nói:

// * polling
// * synchronization
// * eventual consistency
// * stable CI behavior

// ---

// # 3. Tại sao weak assertion nguy hiểm?

// Điểm cần nói:

// * false confidence
// * miss business bug
// * vague validation
// * poor regression quality

// ---

// # 4. Deterministic testing là gì?

// Điểm cần nói:

// * predictable outcome
// * stable execution
// * repeatable result
// * environment consistency

// ---

// # Kết thúc Day 3

// Nếu hôm nay bạn chỉ học:

// ```text
// toHaveText()
// ```

// => chưa đủ.

// Nếu hôm nay bạn hiểu:

// ```text
// assertion = synchronization
// ```

// và:

// ```text
// flaky test thường là timing engineering issue
// ```

// => bạn bắt đầu có mindset automation engineer thật.
