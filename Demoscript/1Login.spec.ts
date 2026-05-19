import { test, expect } from '@playwright/test';

test('Open Google and verify title', async ({ page }) => {
  await page.goto('https://google.com');

  await expect(page.locator('textarea[name="q"]')).toBeVisible();
  // await expect(page).toHaveTitle(/Google/);
  // console.log(await page.title());
});

// npx playwright test Demoscript/1Login.spec.ts --debug --project=chromium
// npx playwright test Demoscript/1Login.spec.ts --repeat-each=10


// git init     
// git add .  
// git commit -m "init dev branch"
// git push -u origin dev   
// git checkout -b dev   



// ⚠️ Nếu bị lỗi “remote origin already exists”
// Chạy:
// git remote remove origin
// git remote add origin https://github.com/PNhatHao/introPlaywright.git
// git remote -v
// git push -u origin dev

// 2. Tạo main từ dev (nếu main chưa có code)
// git checkout dev
// git checkout -b main
// git push -u origin main
// 3. Hoặc merge dev → main (chuẩn công ty hơn)
// git checkout main
// git merge dev
// git push origin main
// update








//--------------------------
// 1. Vì sao Playwright ít flaky hơn Selenium?

// Không trả lời kiểu:
// “vì modern hơn”

// Mà phải nói:

// auto-wait
// browser context isolation
// native browser protocol
// retry/actionability checks


// 2. Vì sao local pass nhưng CI fail?
// Các nguyên nhân:

// timing
// network
// shared environment
// CPU slow
// parallel interference
// state dependency

// 3. Headless và headed khác gì ngoài UI?
// Engineer answer:

// rendering timing
// animation behavior
// GPU difference
// execution speed











// ----------------------
// Đây là một test cơ bản bằng Playwright.
// Mindset của đoạn này không phải “viết code”, mà là:

// > “Mô phỏng hành động user + verify app phản hồi đúng.”

// ---

// ## Nhìn tổng thể flow

// ```js
// test('Open Google and verify title', async ({ page }) => {
//   await page.goto('https://google.com');

//   await expect(page).toHaveTitle(/Google/);
//   console.log(await page.title());
// });
// ```

// Flow tư duy:

// 1. Mở browser page
// 2. Navigate tới Google
// 3. Check title có chứa chữ `"Google"`
// 4. In title ra để debug/log

// ---

// # Breakdown mindset từng dòng

// ---

// ## 1. `test(...)`

// ```js
// test('Open Google and verify title', async ({ page }) => {
// ```

// ### Mindset:

// Đây là **1 test case độc lập**.

// Tên test:

// ```js
// 'Open Google and verify title'
// ```

// là business intention:

// > "Tao muốn verify rằng khi mở Google thì title đúng."

// ---

// ### `async`

// Vì browser actions là async:

// * mở page
// * load network
// * render DOM

// đều tốn thời gian.

// Nên phải dùng:

// ```js
// await
// ```

// để chờ action hoàn tất.

// ---

// ### `{ page }`

// Playwright inject sẵn object browser tab.

// Mindset:

// ```txt
// page = tab browser của user
// ```

// Mọi interaction user làm đều thông qua `page`.

// Ví dụ:

// * click
// * type
// * goto
// * lấy title
// * screenshot

// ---

// # 2. `page.goto(...)`

// ```js
// await page.goto('https://google.com');
// ```

// ### Mindset:

// User action:

// > "User mở website."

// Automation mindset:

// ```txt
// navigate browser tới URL
// ```

// ---

// ### Tại sao phải `await`

// Vì browser cần thời gian:

// * DNS
// * network
// * load HTML
// * load JS

// Nếu không await:

// Test có thể verify quá sớm → flaky.

// ---

// # 3. `expect(page).toHaveTitle(...)`

// ```js
// await expect(page).toHaveTitle(/Google/);
// ```

// Đây là phần QUAN TRỌNG NHẤT với tester mindset.

// ---

// ## Đây là ASSERTION

// Mindset:

// > “Sau khi action xảy ra, system phải ở state mong muốn.”

// ---

// ### Không phải check cứng:

// ```js
// await expect(page).toHaveTitle('Google');
// ```

// Mà dùng regex:

// ```js
// /Google/
// ```

// ---

// ## Vì sao dùng regex?

// Tester mindset:

// Title có thể thay đổi nhẹ:

// Ví dụ:

// ```txt
// Google
// Google Search
// Google Vietnam
// ```

// Regex giúp flexible hơn.

// ---

// ## Quan trọng hơn:

// ### `expect()` trong Playwright có auto-wait

// Nó KHÔNG verify ngay lập tức.

// Nó sẽ retry liên tục trong timeout.

// Mindset:

// ```txt
// UI cần thời gian để stable
// ```

// Đây là lý do Playwright ít flaky hơn Selenium classic.

// ---

// # 4. `console.log(await page.title())`

// ```js
// console.log(await page.title());
// ```

// ### Mindset:

// Debug / observe state.

// Tester automation không chỉ assert.

// Mà còn cần:

// * inspect data
// * log
// * troubleshoot

// ---

// ### `page.title()`

// Lấy actual title runtime.

// Ví dụ output:

// ```txt
// Google
// ```

// ---

// # Góc nhìn Manual Tester → Automation Tester

// Manual tester thường nghĩ:

// ```txt
// 1. Open browser
// 2. Go to site
// 3. Nhìn title
// 4. Confirm đúng
// ```

// Automation chỉ là:

// ```txt
// convert human steps → programmable actions + assertions
// ```

// ---

// # Core mindset automation cần nhớ

// ## Automation =

// ```txt
// Action + Verification
// ```

// Nếu chỉ action mà không verify:

// → không phải test.

// Nếu chỉ verify mà không setup state:

// → meaningless.

// ---

// # Mental model chuẩn của test automation

// Mỗi test nên có:

// ## 1. Arrange

// Setup state

// ```js
// await page.goto(...)
// ```

// ---

// ## 2. Act

// User action

// Ví dụ:

// ```js
// click
// fill
// submit
// ```

// ---

// ## 3. Assert

// Verify expected behavior

// ```js
// expect(...)
// ```

// ---

// Đoạn code này hiện tại:

// ```txt
// Arrange:
// - open Google

// Assert:
// - title contains Google
// ```

// Chưa có Act vì đây là smoke test đơn giản.

// ---

// # Nếu viết theo mindset senior tester

// Thường sẽ nghĩ thêm:

// ## Risk

// * network fail?
// * redirect?
// * localization?
// * browser differences?

// ---

// ## Stability

// * auto wait
// * retry
// * resilient locator

// ---

// ## Assertion quality

// Title verify có đủ meaningful chưa?

// Hay cần verify:

// * search box visible
// * logo visible
// * URL đúng

// ---

// # Version “real testing” hơn

// Ví dụ:

// ```js
// test('Google homepage should display search box', async ({ page }) => {
//   await page.goto('https://google.com');

//   await expect(page.locator('textarea[name="q"]')).toBeVisible();
// });
// ```

// Mindset:

// ```txt
// verify business-critical UI
// ```

// chứ không chỉ title.

// ---

// # Tóm tắt mindset của đoạn code

// ```txt
// 1. Simulate user opening website
// 2. Wait for page ready
// 3. Assert expected browser state
// 4. Log runtime info for debugging
// ```

// Automation testing thực chất là:

// ```txt
// Control browser
// + Observe system
// + Validate expectation
// ```

// chứ không phải “viết script”.
