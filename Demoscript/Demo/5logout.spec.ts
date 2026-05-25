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
// │
// ├── pages/
// │   ├── LoginPage.ts
// │   ├── SecureAreaPage.ts
// │   ├── UploadPage.ts
// │   └── DynamicLoadingPage.ts
// │
// ├── components/
// │   ├── FlashMessage.ts
// │   └── Navbar.ts
// │
// ├── fixtures/
// │   └── auth.fixture.ts
// │
// ├── factories/
// │   └── user.factory.ts
// │
// ├── helpers/
// │   ├── logger.ts
// │   └── api-helper.ts
// │
// ├── utils/
// │   ├── credentials.ts
// │   └── file-path.ts
// │
// ├── test-data/
// │   ├── files/
// │   │   └── upload-file.png
// │   │
// │   └── users/
// │       ├── valid-user.ts
// │       └── invalid-user.ts
// │
// ├── playwright.config.ts
// │
// ├── package.json
// │
// └── tsconfig.json