import { test, expect } from '@playwright/test';
// import { mockLoginApi } from '@helpers/api-helper';

test.describe(
  'Mock API Flow', () => { // API Mocking Regression   
  test( 'mock backend response', async ({ page }) => { //mock login API response
      // await mockLoginApi(page);
      await page.route('**/api/login', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
             users: [
                {
                  id: 1,
                  name: 'Mock User'
                }
              ]
          })
        });
      });

      await page.goto('/login');
      // await page.getByLabel('Username')
      //   .fill('tomsmith');
      // await page.getByLabel('Password')
      //   .fill('SuperSecretPassword!');
      // await page.getByRole('button', {
      //   name: 'Login'
      // }).click();
      await expect(page)
        .toHaveURL(/login/); //authenticate  secure
    });
});