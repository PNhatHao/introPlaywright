import { test as base, BrowserContext, Page } from '@playwright/test';

type MultiUserFixtures = {
  adminPage: Page;
  userPage: Page;
};

export const test =
  base.extend<MultiUserFixtures>({
    adminPage:
      async ({ browser }, use) => {
        const context:
          BrowserContext =
            await browser.newContext();
        const page = await context.newPage();
        await use(page);
        await context.close();
      },

    userPage:
      async ({ browser }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await use(page);
        await context.close();
      }
  });

export { expect } from '@playwright/test';