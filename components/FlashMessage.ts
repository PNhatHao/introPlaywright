import { Locator, Page, expect } from '@playwright/test';

export class FlashMessage {

  readonly page: Page;

  readonly alert: Locator;

  constructor(page: Page) {

    this.page = page;

    this.alert =
      page.locator('#flash');

  }

  async getText() {
    await expect(this.alert).toBeVisible();

    return await this.alert.innerText();
 
    // Bỏ để thay
    // return (await this.alert.textContent())?.trim();

  }

}