import {
  test as base,
  BrowserContext,
  Page
} from '@playwright/test';

import {  loginAs } from '@helpers/auth-helper';
import { credentials } from '@config/credentials';

type AdminFixtures = {

  adminContext: BrowserContext;
  adminPage: Page;
};

export const test =
  base.extend<AdminFixtures>({

    adminContext:
      async ({ browser }, use) => {

        const context = await browser.newContext();
        await use(context);
        await context.close();
      },

    adminPage:
      async ({ adminContext }, use) => {

        const page = await adminContext.newPage();
        await loginAs(
          page,
          credentials.standard.username,     // 'tomsmith',
          credentials.standard.password      // 'SuperSecretPassword!'    
        );
        await use(page);
      }
  });

export { expect } from '@playwright/test';