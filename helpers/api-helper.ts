import { Page }
from '@playwright/test';

export async function mockLoginApi(
  page: Page
) {

  await page.route(
    '**/authenticate',
    async route => {
      await route.fulfill({
        status: 200,
        contentType:
          'application/json',
        body: JSON.stringify({
          success: true,
          token: 'fake-token'
        })
      });
    }
  );
}