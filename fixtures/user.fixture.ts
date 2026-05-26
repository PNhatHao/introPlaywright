import {
  test as base,
  BrowserContext,
  Page
} from '@playwright/test';
import { credentials } from '@config/credentials';
import {  loginAs } from '@helpers/auth-helper';

type UserFixtures = {
  userContext: BrowserContext;
  userPage: Page;
};

export const test =
  base.extend<UserFixtures>({
    userContext: async ({ browser }, use) => {

        const context = await browser.newContext();
        await use(context);
        await context.close();
      },

    userPage: async ({ userContext }, use) => {
        const page = await userContext.newPage();
        await loginAs(
          page,
          credentials.standard.username,     // 'tomsmith',
          credentials.standard.password      // 'SuperSecretPassword!'   
        );
        await use(page);
      }
  });

export { expect }  from '@playwright/test';