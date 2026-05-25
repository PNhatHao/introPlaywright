import { Locator, Page } from '@playwright/test';

export class SecureAreaPage {

  readonly page: Page;

  readonly heading: Locator;
  
  
  readonly flashMessage: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {

    this.page = page;

    this.heading =
      page.getByRole('heading', {
        name: 'Secure Area',
        exact: true
      });

   this.flashMessage = page.locator('#flash');
   this.logoutButton = page.getByRole('link',{name:'Logout'});
  }
  async logout(){await this.logoutButton.click();}

}