import { test,expect } from '@fixtures/auth.fixture';
import { Navbar } from '@components/Navbar';
import { FlashMessage } from '@components/FlashMessage';

test.describe(
  'Smoke - Logout Flow', () => {   
    test('authenticated user can logout', async ({ loggedInPage }) => {
      const page = loggedInPage;
      const flash = new FlashMessage(page);
      const navbar = new Navbar(page);

      await navbar.logout();
      await expect(page).toHaveURL(/login/);
      await expect(flash.alert).toContainText('You logged out');
    });
  }
);