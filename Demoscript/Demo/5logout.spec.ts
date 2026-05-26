import { test, expect }
  from '@fixtures/auth.fixture';

import { Navbar }
  from '@components/Navbar';
//import { SecureAreaPage }from '@pages/SecureAreaPage';
import { FlashMessage } from '@components/FlashMessage';

test.describe(
  'Logout Flow',
  () => {

  test(
    'user can logout',
    async ({ loggedInPage }) => {
      const page = loggedInPage;
      const navbar =
        new Navbar(page);
      //const securePage = new SecureAreaPage(  loggedInPage );
      const flash = new FlashMessage(page);

      await navbar.logout();

      await expect(
        page
      ).toHaveURL(/login/);

      await expect(
        flash.alert  
      ).toContainText(
        'You logged out'
      );

    });

});


// playwright-production-framework/
// │
// ├── env/
// │   ├── .env.local
// │   └── .env.staging
// │
// ├── auth/
// │   ├── auth.json
// │   └── global.setup.ts
// │
// ├── config/
// │   ├── env.ts
// │   ├── credentials.ts
// │   └── timeouts.ts
// │
// ├── tests/
// │   ├── smoke/
// │   │   ├── login.smoke.spec.ts
// │   │   └── logout.smoke.spec.ts
// │   │
// │   ├── regression/
// │   │   ├── upload.regression.spec.ts
// │   │   ├── dynamic-loading.regression.spec.ts
// │   │   ├── api-mocking.regression.spec.ts
// │   │   └── isolation.regression.spec.ts
// │   │
// │   └── multi-user/
// │       ├── admin-create-user.spec.ts
// │       ├── unauthorized-access.spec.ts
// │       └── multi-context-chat.spec.ts
// │
// ├── pages/
// │   ├── LoginPage.ts
// │   ├── SecureAreaPage.ts
// │   ├── UploadPage.ts
// │   └── DynamicLoadingPage.ts
// │   └── AdminPage.ts
// │
// ├── components/
// │   ├── FlashMessage.ts
// │   └── Navbar.ts
// │
// ├── fixtures/
// │   └── auth.fixture.ts
// │   ├── user.fixture.ts
// │   ├── admin.fixture.ts
// │   └── api.fixture.ts
// │
// ├── factories/
// │   └── user.factory.ts
// │
// ├── helpers/
// │   ├── logger.ts
// │   └── api-helper.ts
// │   └── auth-helper.ts
// │
// ├── utils/
// │   └── file-path.ts
// │
// ├── playwright.config.ts
// ├── package.json
// └── tsconfig.json