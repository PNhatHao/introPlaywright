// npx playwright test tests/5auth.spec.ts --debug --project=chromium
// npx playwright test tests/5logout.spec.ts --debug --project=chromium
// // Full Production-like Playwright Test

import { test, expect }
  from '../fixture/5auth.fixture';

import { Navbar }
  from '../5components/Navbar';

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