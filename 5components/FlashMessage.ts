import { Locator, Page } from '@playwright/test';

export class FlashMessage {

  readonly page: Page;

  readonly alert: Locator;

  constructor(page: Page) {

    this.page = page;

    this.alert =
      page.locator('#flash');

  }

  async getText() {

    return (
      await this.alert.textContent()
    )?.trim();

  }

}