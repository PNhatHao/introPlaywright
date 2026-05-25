import { test, expect } from '@playwright/test';

import { DynamicLoadingPage } from '@pages/DynamicLoadingPage';

test.describe(
  'Dynamic Loading Regression',
  () => {

  test(
    'dynamic content loads reliably',
    async ({ page }) => {

      const dynamicPage = new DynamicLoadingPage(page);

      await dynamicPage.goto();

      await dynamicPage.startLoading();

      await expect(
        dynamicPage.finishText
      ).toContainText(
        'Hello World!',
        {
          timeout: 10000
        }
      );

    });

});