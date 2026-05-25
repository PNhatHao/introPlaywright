import { test, expect }
  from '@fixtures/auth.fixture';

import { SecureAreaPage }
  from '@pages/SecureAreaPage';

import { FlashMessage }
  from '@components/FlashMessage';

test.describe(
  'Authentication Suite',
  () => {

  test(
    'user can login successfully',
    async ({ loggedInPage }) => {
    // ==============================
    // EXPLICIT SETUP BOUNDARY
    // ==============================
    const page = loggedInPage;

      const securePage =
        new SecureAreaPage(
          page
        );

      const flash = new FlashMessage(  page );

    // ==============================
    // BUSINESS ASSERTIONS
    // ==============================
      await expect(
        securePage.heading
      ).toBeVisible();

      await expect(
        securePage.heading
      ).toContainText(
        'Secure Area'
      );

      await expect(
        flash.alert // loggedInPage.locator('#flash')  // was duplicate abstraction securePage.flashMessage
      ).toContainText(
        'You logged into a secure area!'
      );

      // console.log(await flash.getText() ); // không nên để trong regression test

    });

});
// npx playwright test tests/5auth.spec.ts --debug --project=chromium
// npx playwright test tests/5logout.spec.ts --debug --project=chromium
// // Full Production-like Playwright Test
