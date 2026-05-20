import { Locator, Page } from '@playwright/test';

export class Navbar {

  readonly page: Page;

  readonly logoutButton: Locator;

  constructor(page: Page) {

    this.page = page;

    this.logoutButton =
      page.getByRole('link', {
        name: 'Logout'
      });

  }

  async logout() {

    await this.logoutButton.click();

  }

}