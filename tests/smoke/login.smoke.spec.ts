import { test,expect } from '@fixtures/auth.fixture';
import { SecureAreaPage } from '@pages/SecureAreaPage';
import { FlashMessage } from '@components/FlashMessage';

test.describe(
  'Smoke - Login Flow', () => {   
    test('authenticated user reaches secure area', async ({ loggedInPage }) => {
    // ==============================
    // EXPLICIT SETUP BOUNDARY
    // ==============================
      const page = loggedInPage;
      const securePage = new SecureAreaPage(page);
      const flash = new FlashMessage(page);

    // ==============================
    // BUSINESS ASSERTIONS
    // ==============================
      await expect(securePage.heading).toBeVisible();
      await expect(securePage.heading ).toContainText( 'Secure Area');
      await expect(flash.alert).toContainText('You logged into a secure area!');
    });
  }
);