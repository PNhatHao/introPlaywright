import { test, expect }
  from '@fixtures/auth.fixture';

import { Navbar }
  from '@components/Navbar';

test.describe(
  'Logout Flow',
  () => {

  test(
    'user can logout',
    async ({ loggedInPage }) => {

      const navbar =
        new Navbar(loggedInPage);

      await navbar.logout();

      await expect(
        loggedInPage
      ).toHaveURL(/login/);

      await expect(
        loggedInPage.locator(
          '#flash'
        )
      ).toContainText(
        'You logged out'
      );

    });

});


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