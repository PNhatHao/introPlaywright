// npx playwright test tests/5auth.spec.ts --debug --project=chromium
// npx playwright test tests/5logout.spec.ts --debug --project=chromium
// // Full Production-like Playwright Test

import { test, expect }
  from '../fixture/5auth.fixture';

import { SecureAreaPage }
  from '../5LoginPage/SecureAreaPage';

import { FlashMessage }
  from '../5components/FlashMessage';

test.describe(
  'Authentication Suite',
  () => {

  test(
    'user can login successfully',
    async ({ loggedInPage }) => {

      const securePage =
        new SecureAreaPage(
          loggedInPage
        );

      const flash =
        new FlashMessage(
          loggedInPage
        );

      await expect(
        securePage.heading
      ).toBeVisible();

      await expect(
        securePage.heading
      ).toContainText(
        'Secure Area'
      );

      await expect(
        loggedInPage
          .locator('#flash')
      ).toContainText(
        'You logged into a secure area!'
      );

      console.log(
        await flash.getText()
      );

    });

});