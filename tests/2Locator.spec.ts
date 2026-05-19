import { test, expect } from '@playwright/test';

test('locator strategy comparison', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');

  const username = page.locator('#username');

  const password = page.locator('#password');

  const loginButton = page.getByRole('button', {
    name: 'Login'
  });

  await username.fill('tomsmith');
  await password.fill('SuperSecretPassword!');

  await loginButton.click();

  await expect(page).toHaveURL(/secure/);
});

// // npx playwright test tests/1flaky.spec.ts --repeat-each=10
// npx playwright test tests/1flaky.spec.ts --debug --project=chromium



// # WEEK 1 — DAY 2

// # Locator Engineering + Assertion Stability

// Hôm nay là ngày cực kỳ quan trọng.

// Đây là lúc bắt đầu phân biệt:

// ```text
// người biết Playwright
// ```

// và

// ```text
// automation engineer thật
// ```

// ---

// # 🎯 Goal hôm nay

// Sau Day 2 bạn phải hiểu:

// * tại sao locator fragile
// * tại sao XPath deep nesting nguy hiểm
// * tại sao CSS class dễ fail
// * assertion nào weak
// * assertion nào stable
// * locator là “contract” với UI
// * automation fail vì DOM thay đổi như thế nào

// ---

// # Hôm nay bạn sẽ học

// | Chủ đề               | Ý nghĩa thật                |
// | -------------------- | --------------------------- |
// | Locator strategy     | stability engineering       |
// | Accessible selectors | maintainable automation     |
// | Assertion retry      | deterministic testing       |
// | Locator debugging    | flaky root-cause            |
// | Anti-pattern locator | maintenance cost            |
// | Semantic testing     | production-grade automation |

// ---

// # PHẦN 1 — Locator không phải “cách tìm element”

// # Đây là mindset quan trọng nhất hôm nay

// Người mới nghĩ:

// ```text
// locator = cách click được button
// ```

// Engineer nghĩ:

// ```text
// locator = contract giữa automation và UI
// ```

// ---

// # Ví dụ fragile contract

// ```ts id="9qux12"
// page.locator('.btn-primary')
// ```

// Tại sao fragile?

// Vì dev đổi:

// ```css id="zjlwmq"
// .btn-primary
// ```

// →

// ```css id="q2lqdr"
// .btn-v2
// ```

// Test chết.

// Business logic KHÔNG đổi.
// UI chỉ refactor CSS.

// => automation fail vô nghĩa.

// ---

// # Đây gọi là:

// # DOM coupling

// Test bị phụ thuộc implementation detail.

// ---

// # PHẦN 2 — Locator hierarchy (rất quan trọng)

// # Playwright ưu tiên locator theo semantic

// # Thứ tự ưu tiên nên dùng

// ```text
// getByRole
// getByLabel
// getByPlaceholder
// getByText
// getByTestId
// CSS
// XPath
// ```

// ---

// # Tại sao `getByRole()` mạnh nhất?

// Ví dụ:

// ```ts id="o6tjlwm"
// page.getByRole('button', {
//   name: 'Login'
// });
// ```

// Nó stable vì:

// * semantic
// * accessibility-aware
// * ít phụ thuộc DOM structure
// * survive CSS refactor

// ---

// # Đây là mindset production

// Automation không nên phụ thuộc:

// ❌ màu sắc
// ❌ position
// ❌ class styling
// ❌ nested div structure

// Automation nên phụ thuộc:

// ✅ user-facing behavior
// ✅ accessible meaning
// ✅ semantic intent

// ---

// # Exercise 1 — Quan sát locator fragile

// Tạo file:

// ```text
// tests/day2-locator.spec.ts
// ```

// Code:

// ```ts id="a9e7pc"
// import { test, expect } from '@playwright/test';

// test('locator strategy comparison', async ({ page }) => {
//   await page.goto('https://the-internet.herokuapp.com/login');

//   const username = page.locator('#username');

//   const password = page.locator('#password');

//   const loginButton = page.getByRole('button', {
//     name: 'Login'
//   });

//   await username.fill('tomsmith');
//   await password.fill('SuperSecretPassword!');

//   await loginButton.click();

//   await expect(page).toHaveURL(/secure/);
// });
// ```

// ---

// # 🎯 Task

// Quan sát:

// * locator nào semantic hơn
// * locator nào fragile hơn
// * locator nào readable hơn

// ---

// # PHẦN 3 — CSS locator vs Role locator

// # Compare

// ## Fragile

// ```ts id="vhgjlwm"
// page.locator('.radius')
// ```

// ---

// ## Better

// ```ts id="nsjlwm"
// page.getByRole('button', {
//   name: 'Login'
// });
// ```

// ---

// # Tại sao?

// CSS class thường đổi vì:

// * redesign
// * Tailwind migration
// * UI refactor
// * theming

// Nhưng button “Login” thường không đổi.

// ---

// # Engineering mindset

// Stable automation phải bám:

// ```text
// business meaning
// ```

// không phải:

// ```text
// frontend implementation
// ```

// ---

// # PHẦN 4 — XPath deep nesting là mùi code

// # Bad

// ```xpath
// /html/body/div[2]/div/div/form/button
// ```

// ---

// # Tại sao cực nguy hiểm?

// Chỉ cần dev thêm:

// ```html
// <div>
// ```

// là test chết.

// ---

// # Đây là:

// # Structure-coupled automation

// Rất fragile.

// ---

// # Rule production-grade

// Nếu locator nhìn giống:

// ```text
// copy từ DevTools
// ```

// => thường là locator tệ.

// ---

// # PHẦN 5 — Assertions thật sự hoạt động thế nào

// # Người mới thường viết:

// ```ts id="5pbjlwm"
// const text = await page.locator('.msg').textContent();

// expect(text).toBe('Success');
// ```

// ---

// # Tại sao yếu?

// Vì:

// ```ts id="jlwmn5"
// textContent()
// ```

// lấy snapshot NGAY LẬP TỨC.

// Không retry.

// ---

// # Nếu UI render chậm?

// Race condition.

// => flaky.

// ---

// # Better

// ```ts id="q7jlwm"
// await expect(page.locator('.msg'))
//   .toHaveText('Success');
// ```

// ---

// # Tại sao mạnh hơn?

// Vì:

// ```text
// toHaveText()
// ```

// có:

// * auto retry
// * polling
// * synchronization

// ---

// # Đây là mindset cực quan trọng

// Assertion không chỉ verify.

// Assertion còn:

// # synchronize test flow.

// ---

// # Exercise 2 — Quan sát assertion retry

// Tạo:

// ```ts id="vjlwm7"
// import { test, expect } from '@playwright/test';

// test('assertion retry demo', async ({ page }) => {
//   await page.goto('https://the-internet.herokuapp.com/dynamic_loading/1');

//   await page.getByRole('button', {
//     name: 'Start'
//   }).click();

//   await expect(page.locator('#finish'))
//     .toHaveText('Hello World!');
// });
// ```

// ---

// # 🎯 Observe

// Playwright sẽ:

// * retry
// * polling
// * wait UI render

// Bạn không cần sleep.

// ---

// # PHẦN 6 — Hard wait vs smart wait

// # Người mới:

// ```ts id="qjlwm6"
// waitForTimeout(5000)
// ```

// ---

// # Engineer:

// ```ts id="jlwmx4"
// await expect(locator).toBeVisible()
// ```

// ---

// # Khác biệt cực lớn

// ## Hard wait

// ```text
// đợi thời gian
// ```

// ---

// ## Smart wait

// ```text
// đợi condition
// ```

// ---

// # Đây là core mindset

// Automation engineer không hỏi:

// ```text
// "đợi bao lâu?"
// ```

// Mà hỏi:

// ```text
// "đợi event/state gì?"
// ```

// ---

// # PHẦN 7 — Refactor Task

// # Refactor BAD CODE này

// ```ts id="jlwmk8"
// await page.goto('/login');

// await page.waitForTimeout(3000);

// await page.locator('.input-user').fill('admin');

// await page.locator('.input-pass').fill('123456');

// await page.locator('.btn-login').click();

// await page.waitForTimeout(5000);

// expect(await page.locator('.success').textContent())
//   .toBe('Welcome');
// ```

// ---

// # 🎯 Mục tiêu refactor

// * remove hard wait
// * semantic locator
// * retryable assertion
// * readable intent

// ---

// # Một version tốt hơn

// ```ts id="9jlwm5"
// await page.goto('/login');

// await page.getByLabel('Username')
//   .fill('admin');

// await page.getByLabel('Password')
//   .fill('123456');

// await page.getByRole('button', {
//   name: 'Login'
// }).click();

// await expect(page.getByText('Welcome'))
//   .toBeVisible();
// ```

// ---

// # PHẦN 8 — Debugging locator

// # Khi locator fail

// KHÔNG được làm:

// ```text
// "thêm sleep thử xem"
// ```

// ---

// # Phải debug:

// ## 1. Element chưa render?

// ## 2. Element hidden?

// ## 3. Wrong frame?

// ## 4. Wrong accessible name?

// ## 5. Dynamic DOM?

// ## 6. Animation overlap?

// ---

// # Đây là debugging thật

// Không phải:

// ```text
// thử random fix
// ```

// ---

// # PHẦN 9 — CI mindset

// # Tại sao locator pass local fail CI?

// ## Local:

// * render nhanh
// * machine mạnh
// * headed mode

// ---

// ## CI:

// * slower rendering
// * headless
// * timing khác
// * parallel

// ---

// # Fragile locator sẽ lộ mặt ở CI trước tiên.

// Đó là lý do:

// * semantic locator
// * retry assertion
// * proper waiting

// rất quan trọng.

// ---

// # TASKS HÔM NAY

// # Task 1

// Viết login test bằng:

// * CSS locator
// * role locator

// So sánh độ readable/stable.

// ---

// # Task 2

// Cố tình dùng XPath deep nesting.

// Quan sát độ fragile.

// ---

// # Task 3

// Refactor assertion snapshot → retry assertion.

// ---

// # Task 4

// Xóa toàn bộ:

// ```ts
// waitForTimeout
// ```

// ---

// # Task 5

// Dùng:

// ```bash
// --debug
// ```

// Quan sát locator resolution.

// ---

// # INTERVIEW TRAINING

// # 1. Tại sao CSS class locator fragile?

// Điểm cần nói:

// * UI refactor
// * styling change
// * implementation detail
// * unstable contract

// ---

// # 2. Tại sao role locator tốt hơn?

// Điểm cần nói:

// * semantic
// * accessibility-aware
// * stable
// * user-facing meaning

// ---

// # 3. Tại sao assertion snapshot dễ flaky?

// Ví dụ:

// ```ts
// expect(await locator.textContent())
// ```

// Điểm cần nói:

// * no retry
// * race condition
// * async rendering

// ---

// # 4. Tại sao hard wait nguy hiểm?

// Điểm cần nói:

// * timing assumption
// * CI instability
// * slow regression
// * hide synchronization issue

// ---

// # Kết thúc Day 2

// Nếu hôm nay bạn chỉ học:

// ```text
// cách viết locator
// ```

// => chưa đủ.

// Nếu hôm nay bạn hiểu:

// ```text
// locator = stability contract
// assertion = synchronization
// ```

// => bạn bắt đầu nghĩ như automation engineer thật.
