import { test as base, expect, Page } from '@playwright/test';
import { LoginPage }  from '@pages/LoginPage';
import { credentials } from '@config/credentials';

type MyFixtures = {
  loggedInPage: Page;
};

export const test = base.extend<MyFixtures>({
   loggedInPage:
      async ({ browser }, use) => { // browswer -> page
        const context = await browser.newContext();
        const page = await context.newPage();
        
        const loginPage =
          new LoginPage(page);

        await loginPage.goto();

        await loginPage.login(
          credentials.standard.username,     // 'tomsmith',
          credentials.standard.password      // 'SuperSecretPassword!'    
        );
        // STATE-DRIVEN ASSERTION
        await expect(page).toHaveURL(/secure/);
        // EXPLICIT TEST SETUP
        await use(page);
        await context.close();
      }
  });

  export { expect }; //  from '@playwright/test';