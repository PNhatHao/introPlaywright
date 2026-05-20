import { test as base, expect, Page } from '@playwright/test';
import { LoginPage }  from '@pages/LoginPage';
import { users } from '../test-data/users';

type MyFixtures = {
  loggedInPage: Page;
};

export const test = base.extend<MyFixtures>({
   loggedInPage:
      async ({ page }, use) => {

        const loginPage =
          new LoginPage(page);

        await loginPage.goto();

        await loginPage.login(
          users.standard.username,     // 'tomsmith',
          users.standard.password      // 'SuperSecretPassword!'    
        );
        await use(page);
      }
  });

  export { expect } from '@playwright/test';