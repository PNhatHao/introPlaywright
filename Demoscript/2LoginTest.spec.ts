// import { test, expect } from '@playwright/test';

// test('Login success', async ({ page }) => {
//   await page.goto('https://the-internet.herokuapp.com/login');

//   await page.getByLabel('Username').fill('tomsmith');
//   await page.getByLabel('Password').fill('SuperSecretPassword!');

//   await page.getByRole('button', { name: 'Login' }).click();

//   await expect(
//     page.getByRole('heading', {
//       name: 'Secure Area',
//       exact: true
//     })
//   ).toBeVisible();
//   // 
//   await expect(page.locator('#flash')) // Có success message
//     .toContainText('You logged into a secure area!');

//   await expect(page).toHaveURL(/secure/);
// });


import { test, expect } from '@playwright/test';

test('Login success', async ({ page }) => {
  await page.goto('https://the-internet.herokuapp.com/login');

  // Tìm input liên kết với label “Username” và "Password".
  await page.getByLabel('Username').fill('tomsmith');
  await page.getByLabel('Password').fill('SuperSecretPassword!');

  // Tìm button có accessible name là Login.
  await page.getByRole('button', {name: 'Login'}).click();

  await expect(page).toHaveURL(/secure/);
  //
  await expect(
    page.getByRole('heading', {
      name: 'Secure Area',  //   name: /^Secure Area$/
      exact: true
    })
  ).toBeVisible();

  await expect(page.locator('#flash'))
  .toContainText('You logged into a secure area!');
    // Bỏ dòng này
  // await expect(page.getByRole('heading'))
  // .toContainText('Secure Area');


  // có thể thay dòng 39----------
    await expect(
    page.getByRole('heading', {
      level: 2,
      name: 'Secure Area'
    })
  ).toBeVisible();
  //-----------------

});

// npx playwright test Demoscript/2LoginTest.spec.ts --debug --project=chromium
// npx playwright test Demoscript/2LoginTest.spec.ts --repeat-each=10



// Ngày 2 này ổn cho người mới bắt đầu, nhưng nếu mục tiêu của bạn là:

// * survive trong automation team thật
// * pass interview tốt
// * giảm flaky test
// * build mindset engineer

// thì có vài điểm cần nâng cấp mạnh.

// ---

// # 1. Điểm còn thiếu lớn nhất: “Why”

// Hiện tại roadmap đang dạy:

// > dùng cái gì

// Nhưng automation engineer cần:

// > tại sao dùng như vậy

// Ví dụ:

// ```ts
// getByRole()
// ```

// Không chỉ vì “recommended”.

// Mà vì:

// * stable hơn CSS dynamic
// * gần accessibility tree
// * ít coupling với UI implementation
// * survive refactor tốt hơn
// * phản ánh user behavior

// Đây là mindset quan trọng.

// ---

// # 2. Đang thiếu phần “locator fragility”

// Junior rất hay viết:

// ```ts
// page.locator('.btn')
// ```

// và nghĩ pass là ổn.

// Nhưng bạn cần học:

// * selector coupling
// * DOM dependency
// * brittle locator
// * dynamic rendering
// * nth-child hell

// Ví dụ thực tế:

// ```ts
// page.locator('button')
// ```

// Pass hôm nay.

// Fail sau khi dev thêm button mới.

// ---

// # 3. `getByRole()` không phải luôn tốt nhất

// Đây là điều nhiều tutorial không nói.

// Ví dụ:

// ```ts
// getByRole('button', { name: 'Login' })
// ```

// Sẽ fail nếu:

// * text đổi thành “Sign in”
// * localization
// * hidden accessible label
// * duplicated buttons

// Engineer mindset:

// > locator strategy depends on product behavior.

// ---

// # 4. Assertion section còn quá basic

// Ví dụ này:

// ```ts
// await expect(page).toHaveURL(/secure/);
// ```

// chưa đủ mạnh.

// Vì:

// * URL đúng chưa chắc login thành công
// * app có thể redirect lỗi
// * auth token fail
// * partial render

// Better:

// ```ts
// await expect(page.getByRole('heading'))
//   .toContainText('Secure Area');

// await expect(page.locator('#flash'))
//   .toContainText('You logged into a secure area!');
// ```

// Assertion tốt phải:

// * verify business outcome
// * verify user-visible state
// * giảm false positive

// ---

// # 5. Thiếu phần “Auto-wait mechanics”

// Đây là phần phân biệt:

// * người biết Playwright
//   vs
// * người debug được flaky CI

// Bạn cần hiểu Playwright wait:

// * visible
// * attached
// * stable
// * enabled
// * receivable

// trước khi click.

// Nếu không hiểu phần này, sau này bạn sẽ spam:

// ```ts
// waitForTimeout(5000)
// ```

// rồi CI vẫn fail.

// ---

// # 6. Thiếu bài tập “test intentionally flaky”

// Cái này cực kỳ quan trọng.

// Ví dụ:

// * loading spinner
// * delayed toast
// * animation
// * debounce input

// để bạn học:

// * race condition
// * retryability
// * timing issue

// Automation engineer giỏi không phải người viết test pass.
// Mà là:

// > người biết tại sao test fail.

// ---

// # 7. Codegen phải được dạy đúng cách

// Nhiều beginner hiểu sai:

// > codegen sinh code → dùng luôn.

// Không.

// Codegen chỉ để:

// * inspect DOM
// * discover locator
// * nhanh prototype

// Sau đó phải refactor.

// Ví dụ codegen sinh:

// ```ts
// page.locator('div:nth-child(2) > button')
// ```

// Engineer phải nhận ra:

// > fragile immediately.

// ---

// # 8. Đây mới là bài tập “đúng chất team thật”

// ## Bài tập A — viết locator ranking

// Cho 5 locator.
// Bạn phải explain:

// * locator nào stable nhất
// * locator nào risky
// * tại sao

// Ví dụ:

// ```ts
// .locator('.btn-primary')
// .getByRole('button', { name: 'Login' })
// .locator('#submit')
// .getByText('Login')
// .locator('//button[2]')
// ```

// ---

// ## Bài tập B — debug flaky login

// Triệu chứng:

// * local pass
// * CI fail random

// Bạn phải investigate:

// * network?
// * rendering?
// * timing?
// * animation?
// * stale state?
// * parallel execution?

// Đây mới là training thực tế.

// ---

// # 9. Điều quan trọng nhất cần hiểu ngay từ tuần 1

// Automation không phải:

// > “convert manual test case thành script”

// Mà là:

// * build reliable signal
// * reduce regression risk
// * support CI/CD
// * create maintainable safety net

// Đó là lý do:

// * locator strategy quan trọng
// * assertion quality quan trọng
// * flaky handling quan trọng

// ---

// # Nếu mình redesign Ngày 2 theo chuẩn engineering

// Mình sẽ chia:

// ## Part 1 — Locator psychology

// * stable vs fragile
// * semantic selector
// * accessibility tree
// * DOM coupling

// ## Part 2 — Assertion engineering

// * false positive
// * weak assertion
// * business validation

// ## Part 3 — Auto-wait internals

// * why Playwright smarter than Selenium
// * actionability checks
// * retry mechanism

// ## Part 4 — Flaky lab

// * intentionally unstable UI
// * debug + fix

// ## Part 5 — Refactor generated code

// * cleanup codegen output
// * reusable locator
// * readable test

// Đây là kiểu training giúp bạn:

// * lên mid nhanh hơn
// * interview tốt hơn
// * vào team thật đỡ sốc hơn



// ------------- Day 2 ngày 2
// # 🗓️ Tuần 1 – Ngày 2 (Engineering Mindset Version)

// # Chủ đề: Locator + Assertion + Login Flow + Flaky Thinking

// Hôm nay là ngày cực kỳ quan trọng.

// Đây là lúc bạn bắt đầu chuyển từ:

// > “script browser”

// thành:

// > “viết automation đáng tin cậy”.

// ---

// # 🎯 Mục tiêu Ngày 2

// Sau hôm nay bạn phải hiểu:

// * locator tốt vs locator nguy hiểm
// * vì sao test flaky
// * assertion mạnh vs assertion yếu
// * Playwright auto-wait thực sự hoạt động thế nào
// * debug locator như engineer
// * semantic selector là gì
// * vì sao XPath thường gây technical debt

// ---

// # PHẦN 1 — Locator không phải “cách tìm element”

// Đây là hiểu sai lớn nhất của beginner.

// Locator thực chất là:

// > strategy để giảm flaky test.

// ---

// # Vì sao locator quan trọng?

// Ví dụ app thay đổi UI:

// ```html id="b4eqgf"
// <button class="btn-primary">
//   Login
// </button>
// ```

// Dev refactor:

// ```html id="o40x8v"
// <button class="btn-main">
//   Login
// </button>
// ```

// Test dùng:

// ```ts id="p80gpi"
// .locator('.btn-primary')
// ```

// => fail.

// ---

// # Nhưng nếu dùng:

// ```ts id="b5z1s3"
// getByRole('button', { name: 'Login' })
// ```

// => vẫn pass.

// ---

// # Automation engineer phải nghĩ:

// ## “UI sẽ thay đổi như thế nào trong tương lai?”

// Đây mới là mindset đúng.

// ---

// # PHẦN 2 — Thứ tự ưu tiên locator (cực kỳ quan trọng)

// ## 🥇 Ưu tiên #1 — `getByRole()`

// ```ts id="8nfc0e"
// page.getByRole('button', { name: 'Login' })
// ```

// Đây là locator tốt nhất trong đa số case.

// Vì:

// * semantic
// * gần user behavior
// * accessibility-aware
// * stable hơn CSS

// ---

// # Nhưng KHÔNG phải lúc nào cũng hoàn hảo

// Ví dụ:

// * duplicated buttons
// * localization
// * dynamic accessible name

// Engineer mindset:

// > locator strategy phụ thuộc UI behavior.

// ---

// # 🥈 `getByLabel()`

// ```ts id="6w4m9f"
// page.getByLabel('Username')
// ```

// Rất tốt cho form.

// ---

// # 🥉 `getByPlaceholder()`

// ```ts id="6cxd6w"
// page.getByPlaceholder('Enter email')
// ```

// Ổn nhưng hơi fragile.

// Placeholder thường bị đổi bởi UX team.

// ---

// # `getByText()`

// ```ts id="vq7d9q"
// page.getByText('Welcome')
// ```

// Dùng được.

// Nhưng dễ fail khi:

// * localization
// * copywriting change
// * duplicated text

// ---

// # `locator()`

// ```ts id="r5xq77"
// page.locator('.submit-btn')
// ```

// Không xấu.

// Nhưng:

// * coupling với implementation
// * dễ brittle

// ---

// # XPath — vì sao engineer ghét?

// ## ❌ Fragile

// ```ts id="pwmph7"
// //*[@id="login"]/div[2]/input
// ```

// Chỉ cần:

// * thêm div
// * đổi layout

// => fail.

// ---

// # XPath còn gây vấn đề:

// * khó đọc
// * khó maintain
// * khó debug
// * coupling DOM structure

// ---

// # PHẦN 3 — Auto-wait mechanics (cực kỳ quan trọng)

// Đây là phần beginner thường KHÔNG hiểu.

// ---

// # Khi bạn viết:

// ```ts id="4r4w40"
// await page.getByRole('button').click();
// ```

// Playwright KHÔNG click ngay.

// Nó sẽ check:

// ## Actionability checks

// * attached?
// * visible?
// * stable?
// * enabled?
// * receivable?

// ---

// # Đây là lý do Playwright ít flaky hơn Selenium.

// ---

// # Nhưng auto-wait KHÔNG solve:

// ## ❌ backend response chậm

// ## ❌ animation weird

// ## ❌ bad assertion

// ## ❌ race condition

// ## ❌ wrong locator

// ---

// # PHẦN 4 — Setup bài thực hành

// Dùng site:

// [The Internet Herokuapp Login](https://the-internet.herokuapp.com/login?utm_source=chatgpt.com)

// ---

// # PHẦN 5 — Viết Login Test đúng mindset

// ## ❌ Beginner version

// ```ts id="yfqz3d"
// await page.locator('#username').fill('tomsmith');
// await page.locator('#password').fill('123');
// await page.locator('button').click();
// ```

// Vấn đề:

// * generic button
// * hard coupling
// * unclear intent

// ---

// # ✅ Better version

// ```ts id="mznxek"
// import { test, expect } from '@playwright/test';

// test('Login success', async ({ page }) => {
//   await page.goto('https://the-internet.herokuapp.com/login');

//   await page.getByLabel('Username').fill('tomsmith');

//   await page.getByLabel('Password')
//     .fill('SuperSecretPassword!');

//   await page
//     .getByRole('button', { name: 'Login' })
//     .click();

//   await expect(page)
//     .toHaveURL(/secure/);

//   await expect(
//     page.locator('#flash')
//   ).toContainText(
//     'You logged into a secure area!'
//   );
// });
// ```

// ---

// # PHẦN 6 — Giải thích mindset từng dòng

// ---

// # `getByLabel('Username')`

// Không chỉ:

// > “tìm input”

// Mà:

// * semantic
// * readable
// * gần user interaction
// * stable hơn CSS

// ---

// # `getByRole('button')`

// Bạn đang nói:

// > “user click login button”

// không phải:

// > “click element có class abcxyz”

// Đây là khác biệt cực lớn.

// ---

// # PHẦN 7 — Assertion Engineering

// Đây là phần rất nhiều junior làm yếu.

// ---

// # ❌ Weak assertion

// ```ts id="9c6v34"
// expect(true).toBeTruthy()
// ```

// Vô nghĩa.

// ---

// # ❌ Weak UI assertion

// ```ts id="4u5mlm"
// await expect(page.locator('.toast'))
//   .toBeVisible();
// ```

// Toast visible chưa chắc đúng business behavior.

// ---

// # ✅ Better

// ```ts id="ibqln5"
// await expect(page.locator('#flash'))
//   .toContainText(
//     'You logged into a secure area!'
//   );
// ```

// Verify:

// * đúng outcome
// * đúng business flow
// * đúng user-visible message

// ---

// # `toContainText()` vs `toHaveText()`

// ## `toHaveText()`

// Exact match.

// ```ts id="r8nd5m"
// await expect(locator)
//   .toHaveText('Success');
// ```

// Fail nếu:

// ```text id="2f7w91"
// Success!
// ```

// ---

// # `toContainText()`

// Substring match.

// ```ts id="qvax2f"
// await expect(locator)
//   .toContainText('Success');
// ```

// Flexible hơn.

// ---

// # Engineer mindset:

// ## Exact match

// * strict validation
// * detect UI regression

// ## Contain match

// * flexible
// * reduce brittle assertion

// ---

// # PHẦN 8 — Login Failed Test

// ## Đây mới là nơi engineer thật sự học

// Success flow luôn dễ.

// Failure flow mới expose bug.

// ---

// # Viết test fail

// ```ts id="wc8awe"
// test('Login failed', async ({ page }) => {
//   await page.goto(
//     'https://the-internet.herokuapp.com/login'
//   );

//   await page.getByLabel('Username')
//     .fill('wrong');

//   await page.getByLabel('Password')
//     .fill('wrong');

//   await page
//     .getByRole('button', { name: 'Login' })
//     .click();

//   await expect(page)
//     .not.toHaveURL(/secure/);

//   await expect(page.locator('#flash'))
//     .toContainText(
//       'Your username is invalid!'
//     );
// });
// ```

// ---

// # PHẦN 9 — Debug locator như engineer

// ## Dùng codegen

// ```bash id="fqv62s"
// npx playwright codegen
// ```

// Hoặc:

// ```bash id="mv2sgq"
// npx playwright codegen https://the-internet.herokuapp.com/login
// ```

// ---

// # Nhưng cực kỳ quan trọng:

// ## KHÔNG copy-paste blindly.

// Codegen sinh code để:

// * inspect DOM
// * prototype nhanh
// * discover locator

// KHÔNG phải final code.

// ---

// # Ví dụ codegen tệ

// ```ts id="2q3hmc"
// locator('div:nth-child(2) > button')
// ```

// Engineer phải nhận ra:

// > brittle immediately.

// ---

// # PHẦN 10 — Flaky Thinking (cực kỳ quan trọng)

// ## Tại sao test pass local nhưng fail CI?

// Ví dụ:

// * CPU chậm hơn
// * animation timing khác
// * network delay
// * parallel execution
// * environment unstable

// ---

// # Đây là thứ dangerous nhất:

// ```ts id="s97lg7"
// waitForTimeout(5000)
// ```

// Junior nghĩ:

// > fix flaky.

// Reality:

// > hide flaky temporarily.

// ---

// # Engineer mindset:

// Không hỏi:

// > “làm sao delay thêm?”

// Mà hỏi:

// > “system đang wait cái gì?”

// ---

// # PHẦN 11 — Bài tập thực chiến Ngày 2

// ---

// # ✅ Task 1 — Login success

// Verify:

// * URL
// * success message
// * heading visible

// ---

// # ✅ Task 2 — Login failed

// Verify:

// * no redirect
// * error message
// * user vẫn ở login page

// ---

// # ✅ Task 3 — Compare locator stability

// Cho các locator sau:

// ```ts id="ccti2c"
// button
// .btn-primary
// #login-btn
// getByRole('button', { name: 'Login' })
// xpath=//button[2]
// ```

// Hãy ranking:

// * stable nhất
// * dangerous nhất

// và explain WHY.

// ---

// # ✅ Task 4 — Intentional flaky test

// Thêm:

// ```ts id="rfjlwm"
// waitForTimeout(1000)
// ```

// Sau đó:

// * throttle CPU
// * chạy headed/debug
// * observe behavior

// Mục tiêu:

// > học timing issue.

// ---

// # PHẦN 12 — Kỹ năng quan trọng nhất hôm nay

// Không phải syntax.

// Mà là:

// ## 1. Locator strategy

// ## 2. Assertion quality

// ## 3. Flaky awareness

// ## 4. Semantic thinking

// ## 5. Debug observation

// ---

// # PHẦN 13 — Câu hỏi phỏng vấn thực chiến

// ---

// # 1. Vì sao Playwright recommend `getByRole()`?

// Good answer:

// * semantic
// * accessibility-aware
// * stable hơn implementation selector
// * gần user interaction

// ---

// # 2. Vì sao XPath dễ flaky?

// * DOM coupling
// * structure dependency
// * hard maintainability

// ---

// # 3. Vì sao không nên dùng `waitForTimeout()`?

// * arbitrary delay
// * slow test
// * hide synchronization issue
// * không deterministic

// ---

// # 4. Assertion tốt là gì?

// Assertion tốt:

// * verify business outcome
// * reduce false positive
// * user-visible behavior

// ---

// # Deliverable cuối ngày

// Bạn nên có:

// ## ✅ 2 login tests

// ## ✅ hiểu semantic locator

// ## ✅ hiểu assertion quality

// ## ✅ hiểu auto-wait cơ bản

// ## ✅ biết codegen đúng cách

// ## ✅ bắt đầu nghĩ như engineer

// ---

// # Homework tối nay

// ## 1. Refactor locator

// Thử:

// * CSS
// * XPath
// * getByRole

// và compare.

// ---

// ## 2. Intentionally break test

// Đổi:

// * button text
// * assertion text

// quan sát error.

// ---

// ## 3. Chạy nhiều lần

// ```bash id="h6lkah"
// npx playwright test --repeat-each=10
// ```

// Quan sát:

// * test có deterministic không
// * timing có inconsistent không

// ---

// Ngày 3 sẽ bắt đầu phần:

// * checkbox
// * dropdown
// * upload
// * dynamic UI
// * explicit wait strategy
// * loading spinner
// * retryability
// * network synchronization

// Đây là lúc automation bắt đầu giống production system thật.
