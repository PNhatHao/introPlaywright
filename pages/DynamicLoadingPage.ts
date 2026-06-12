import { Locator, Page } from '@playwright/test';

export class DynamicLoadingPage {

  readonly page: Page;
  readonly startButton: Locator;
  readonly finishText: Locator;
  readonly loadingIndicator: Locator;

  constructor(page: Page) {

    this.page = page;
    this.startButton =
      page.getByRole('button', {
        name: 'Start'
      });
    this.finishText = page.locator('#finish');
    this.loadingIndicator = page.locator('#loading');
  }

  async goto() {
    await this.page.goto('/dynamic_loading/2');
  }
  async startLoading() {
    await this.startButton.click();
  }
  async waitForLoaded() {
    await this.finishText
      .waitFor({
        state: 'visible'
      });
  }
}