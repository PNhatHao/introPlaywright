import {  test,  expect } from '@playwright/test';

test.describe(
  'Multi Context Simulation',  () => {

  test( 'two users isolated by context',
    async ({ browser }) => {

      const adminContext = await browser.newContext();
      const userContext = await browser.newContext();
      const adminPage = await adminContext.newPage();
      const userPage = await userContext.newPage();

      await adminPage.goto('/login');
      await userPage.goto('/login');

      await expect(adminPage).toHaveURL(/login/);
      await expect(userPage).toHaveURL(/login/);

      await adminContext.close();
      await userContext.close();

    });

});