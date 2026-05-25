import { Locator, Page } from '@playwright/test';

export class LoginPage {

  readonly page: Page;

  readonly usernameInput: Locator;

  readonly passwordInput: Locator;

  readonly loginButton: Locator;

  constructor(page: Page) {

    this.page = page;

    this.usernameInput =
      page.getByLabel('Username');

    this.passwordInput =
      page.getByLabel('Password');

    this.loginButton =
      page.getByRole('button', {
        name: 'Login'
      });

  }

  async goto() {

    await this.page.goto('/login');

  }

  async login(
    username: string,
    password: string
  ) {

    await this.usernameInput.fill(username);

    await this.passwordInput.fill(password);

    await Promise.all([

      this.page.waitForURL(/secure/), // URL is business contract

      this.loginButton.click()

    ]);
  }
}