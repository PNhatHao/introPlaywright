// // npx playwright test Demoscript/run.spec.ts --debug --project=chromium  
// // npx playwright test Demoscript/run.spec.ts --repeat-each=10
          
// // npx playwright test Demoscript/run.spec.ts --trace on
// // Full Production-like Playwright Test



// npx playwright test tests/5auth.spec.ts --debug --project=chromium
// npx playwright test tests/logout.spec.ts --debug --project=chromium








// my-playwright-framework/
// │
// ├── pages/
// │   ├── LoginPage.ts
// │   ├── SecureAreaPage.ts
// │
// ├── components/
// │   ├── FlashMessage.ts
// │   ├── Navbar.ts
// │
// ├── fixtures/
// │   ├── auth.fixture.ts
// │
// ├── tests/
// │   ├── auth.spec.ts
// │   ├── logout.spec.ts
// │
// ├── playwright.config.ts
// │
// ├── package.json




// # 🗓️ Tuần 1 – Ngày 5 (Engineering Mindset Version)

// # Chủ đề:

// # Test Architecture + Page Object Model + Reusability + Maintainability + CI Mindset

// Đây là ngày rất quan trọng.

// 4 ngày đầu:

// * học Playwright
// * học synchronization
// * học network
// * học flaky handling

// Ngày 5:

// > học cách automation survive khi project lớn lên.

// Vì test suite:

// * 10 tests → dễ
// * 100 tests → bắt đầu đau
// * 1000 tests → architecture quyết định sống còn

// Đây là nơi phân biệt:

// * “người viết script”
//   và
// * “automation engineer”.

// ---

// # 🎯 Mục tiêu Ngày 5

// Sau hôm nay bạn phải hiểu:

// * vì sao automation cần architecture
// * Page Object Model (POM) đúng và sai
// * abstraction hợp lý
// * reusable component
// * maintainability mindset
// * scalable test structure
// * CI-friendly automation
// * anti-pattern nguy hiểm

// ---

// # PHẦN 1 — Automation code là production code

// Junior thường nghĩ:

// ```text id="b98l3t"
// Test code không quan trọng
// ```

// Sai cực nặng.

// Automation code:

// * chạy mỗi ngày
// * block deployment
// * maintain nhiều năm
// * ảnh hưởng CI pipeline

// Test code tệ:

// * flaky
// * slow
// * unreadable
// * nobody trusts it

// => automation chết.

// ---

// # PHẦN 2 — Khi project bắt đầu scale

// Ban đầu:

// ```text id="m2yr9f"
// 5 tests
// ```

// Bạn copy-paste vẫn sống được.

// ---

// # Nhưng sau vài tháng:

// ```text id="m7h7lm"
// 300 tests
// ```

// Suddenly:

// * duplicated locator
// * duplicated login
// * selector update nightmare
// * unreadable flow
// * flaky chain reaction

// ---

// # Đây là lý do architecture quan trọng.

// ---

// # PHẦN 3 — Page Object Model (POM)

// Đây là pattern nổi tiếng nhất trong UI automation.

// ---

// # Ý tưởng chính

// Tách:

// * UI structure
// * business flow
// * test logic

// ---

// # ❌ No structure

// ```ts id="zwx5f1"
// test('login', async ({ page }) => {
//   await page.goto('/login');

//   await page.getByLabel('Username')
//     .fill('admin');

//   await page.getByLabel('Password')
//     .fill('123');

//   await page.getByRole('button', {
//     name: 'Login'
//   }).click();
// });
// ```

// 1 test thì ổn.

// 100 test?
// Nightmare.

// ---

// # ✅ POM version

// ## LoginPage.ts

// ```ts id="n9o7ja"
// export class LoginPage {
//   constructor(private page: Page) {}

//   usernameInput =
//     this.page.getByLabel('Username');

//   passwordInput =
//     this.page.getByLabel('Password');

//   loginButton =
//     this.page.getByRole('button', {
//       name: 'Login'
//     });

//   async goto() {
//     await this.page.goto('/login');
//   }

//   async login(username: string, password: string) {
//     await this.usernameInput.fill(username);

//     await this.passwordInput.fill(password);

//     await this.loginButton.click();
//   }
// }
// ```

// ---

// # Test becomes

// ```ts id="2o9twz"
// test('login success', async ({ page }) => {
//   const loginPage = new LoginPage(page);

//   await loginPage.goto();

//   await loginPage.login(
//     'admin',
//     '123'
//   );
// });
// ```

// ---

// # Lợi ích thật sự của POM

// Không phải:

// > “clean code”

// Mà là:

// ## ✅ centralized locator

// ## ✅ reusable flow

// ## ✅ easier maintenance

// ## ✅ abstraction

// ## ✅ readable intent

// ---

// # Nhưng POM cũng có danger

// Đây là thứ tutorial ít nói.

// ---

// # PHẦN 4 — POM Anti-pattern

// ## ❌ God Object

// ```ts id="shb4ps"
// DashboardPage:
// - login()
// - upload()
// - deleteUser()
// - logout()
// - createOrder()
// ```

// => monster class.

// ---

// # ❌ Assertion inside POM

// ```ts id="r7zpnz"
// async verifyDashboard() {
//   expect(...)
// }
// ```

// Danger:

// * mix responsibility
// * less flexible
// * hidden assertion

// ---

// # Better:

// ## POM:

// * interaction
// * navigation
// * locator

// ## Test:

// * assertion
// * business validation

// ---

// # PHẦN 5 — Component Object Pattern

// Modern UI dùng:

// * modal
// * navbar
// * sidebar
// * toast
// * table component

// Repeated everywhere.

// ---

// # Better abstraction

// ## Example

// ```ts id="o7eqj8"
// export class Navbar {
//   constructor(private page: Page) {}

//   profileMenu =
//     this.page.getByRole('button', {
//       name: 'Profile'
//     });

//   async logout() {
//     await this.profileMenu.click();

//     await this.page.getByText('Logout')
//       .click();
//   }
// }
// ```

// ---

// # Đây là scalable architecture.

// ---

// # PHẦN 6 — Folder Structure (Production-like)

// ## Beginner structure

// ```text id="trphvg"
// tests/
// ```

// Everything inside.

// Chaos eventually.

// ---

// # Better structure

// ```text id="bmjlwm"
// tests/
// pages/
// components/
// fixtures/
// utils/
// test-data/
// helpers/
// ```

// ---

// # Purpose từng folder

// ## `pages/`

// Page objects.

// ---

// ## `components/`

// Reusable UI component abstraction.

// ---

// ## `fixtures/`

// Shared setup/state.

// ---

// ## `utils/`

// Generic utility.

// ---

// ## `test-data/`

// Static mock/input data.

// ---

// # PHẦN 7 — Reusability vs Overengineering

// Junior thường:

// * duplicate everything
//   hoặc
// * abstract everything

// Cả hai đều dangerous.

// ---

// # ❌ Over abstraction

// ```ts id="h2sm8x"
// clickButtonByDynamicUniversalEngine()
// ```

// Nobody understands.

// ---

// # Engineer mindset:

// Abstraction phải:

// * reduce duplication
// * improve readability
// * improve maintenance

// KHÔNG phải:

// > show coding skill.

// ---

// # Rule quan trọng:

// ## Abstract behavior

// KHÔNG abstract randomness.

// ---

// # PHẦN 8 — Test Readability

// Test tốt phải đọc như business flow.

// ---

// # ❌ Hard to read

// ```ts id="qeqs2k"
// await page.locator('#a').fill();
// await page.locator('.b').click();
// ```

// ---

// # Better

// ```ts id="6sbl13"
// await loginPage.login(
//   validUser.email,
//   validUser.password
// );
// ```

// ---

// # Đây là:

// > intent-driven test.

// ---

// # PHẦN 9 — CI/CD Mindset (CỰC KỲ QUAN TRỌNG)

// Nhiều test:

// * local pass
// * CI fail

// Không phải do Playwright yếu.

// Mà do:

// * test design tệ
// * shared state
// * timing issue
// * dependency issue

// ---

// # CI reality

// CI environment:

// * slower CPU
// * parallel execution
// * unstable network
// * containerized
// * no GUI

// ---

// # Test phải:

// ## deterministic

// ## isolated

// ## retry-safe

// ## parallel-safe

// ---

// # PHẦN 10 — Parallel Execution

// Playwright chạy parallel rất mạnh.

// Nhưng dangerous nếu:

// * shared user
// * shared data
// * order dependency

// ---

// # ❌ Example

// Test A:

// ```text id="yqjqyu"
// delete product
// ```

// Test B:

// ```text id="l7e5rx"
// expect product exists
// ```

// Parallel = random fail.

// ---

// # Engineer mindset:

// Every test:

// * own data
// * own setup
// * own cleanup

// ---

// # PHẦN 11 — Retry Mindset

// Playwright support retry.

// ---

// # Nhưng retry KHÔNG phải fix flaky.

// Retry chỉ:

// * reduce noise
// * stabilize pipeline temporarily

// ---

// # Nếu cần retry nhiều:

// Root cause chưa solved.

// ---

// # PHẦN 12 — Observability Engineering

// Đây là mindset rất mạnh.

// Khi test fail:
// Bạn cần evidence.

// ---

// # Add artifacts

// ```ts id="fr1j1o"
// screenshot
// video
// trace
// console logs
// network logs
// ```

// ---

// # Vì sao?

// CI fail:

// * bạn không thấy browser

// Artifacts = forensic evidence.

// ---

// # PHẦN 13 — Example Production-like Test

// ```ts id="mvx0s8"
// test('user can login', async ({
//   loggedInPage
// }) => {

//   await expect(
//     loggedInPage.getByRole('heading')
//   ).toContainText('Dashboard');

// });
// ```

// ---

// # Điều quan trọng:

// Test chỉ chứa:

// * business flow
// * business assertion

// NOT:

// * setup noise
// * login duplication
// * random waits

// ---

// # PHẦN 14 — Scaling Problem

// Khi suite lớn:

// * locator update pain
// * runtime slow
// * flaky cluster
// * maintenance cost

// Engineer phải optimize:

// * fixture
// * auth reuse
// * API setup
// * test sharding
// * parallelization

// ---

// # PHẦN 15 — Mini Architecture Project

// ## Build:

// ### Pages

// * LoginPage
// * DashboardPage

// ### Components

// * Navbar
// * Toast

// ### Fixtures

// * loggedInPage

// ### Tests

// * login
// * logout
// * profile update

// ---

// # Goal:

// * reusable
// * readable
// * isolated
// * scalable

// ---

// # PHẦN 16 — Anti-pattern cực nguy hiểm

// ---

// # ❌ `waitForTimeout`

// Still dangerous.

// ---

// # ❌ Assertion hidden everywhere

// Hard debug.

// ---

// # ❌ Massive page object

// Maintenance hell.

// ---

// # ❌ CSS locator everywhere

// Fragile suite.

// ---

// # ❌ Shared global state

// CI nightmare.

// ---

// # ❌ Test dependency

// Order-sensitive flaky suite.

// ---

// # PHẦN 17 — Câu hỏi phỏng vấn thực chiến

// ---

// # 1. POM solve vấn đề gì?

// Good answer:

// * maintainability
// * locator centralization
// * readability
// * reusable flow

// ---

// # 2. Vì sao over-abstraction dangerous?

// * unreadable
// * hard debug
// * hidden complexity

// ---

// # 3. Vì sao test pass local nhưng fail CI?

// * timing
// * parallel
// * environment
// * shared state
// * flaky synchronization

// ---

// # 4. Retry có phải fix flaky không?

// Không.
// Retry chỉ mask symptom.

// ---

// # 5. Automation architecture tốt là gì?

// * scalable
// * readable
// * isolated
// * maintainable
// * deterministic

// ---

// # Deliverable cuối ngày

// Bạn nên có:

// ## ✅ LoginPage

// ## ✅ DashboardPage

// ## ✅ reusable component

// ## ✅ fixture setup

// ## ✅ isolated tests

// ## ✅ readable tests

// ## ✅ production-like structure

// ## ✅ CI mindset cơ bản

// ---

// # Homework tối nay

// ## 1. Refactor toàn bộ test cũ sang POM

// ---

// # 2. Tạo fixture:

// ```ts id="i7w8o7"
// loggedInPage
// ```

// ---

// # 3. Remove duplicated login flow

// ---

// # 4. Chạy parallel:

// ```bash id="8u7sq6"
// npx playwright test --workers=4
// ```

// Observe flaky/state issue.

// ---

// # 5. Enable trace/video

// Quan sát artifact khi fail.

// ---

// # Điều quan trọng nhất hôm nay

// Automation engineer mạnh không phải:

// > người viết nhiều test

// Mà là:

// > người build automation system có thể sống lâu trong CI/CD pipeline.

// Sau Tuần 1, bạn đã chạm vào:

// * synchronization
// * flaky handling
// * locator strategy
// * mocking
// * architecture
// * isolation
// * maintainability
// * CI mindset

// Đây đã vượt xa rất nhiều tutorial Playwright thông thường.
