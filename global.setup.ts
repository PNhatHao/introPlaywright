import { chromium, FullConfig, expect } from '@playwright/test';
import { LoginPage }  from '@pages/LoginPage';
// import { credentials } from '@config/credentials';
import { users } from 'test-data/users';

export default async function globalSetup(
  config: FullConfig
) {
  // Launch browser
  const browser = await chromium.launch();
  // Create isolated context
  const context = await browser.newContext();
  // Create page
  const page = await context.newPage();
  // Page object
  const loginPage = new LoginPage(page);
  const baseURL = config.projects[0].use.baseURL as string;
  await loginPage.goto(baseURL);
  console.log('Current URL:', await page.url());
  // Perform login
  await loginPage.login(
          users.standard.name,     // 'tomsmith',      await page.getByLabel('Username').fill(users.standard.username);
          users.standard.password      // 'SuperSecretPassword!'        await page.getByLabel('Password').fill(users.standard.password);
  );
  // Verify successful login
  await expect(page).toHaveURL(/secure/);
  // Save authenticated state
  await context.storageState({path: 'auth/auth.json'});

  // await page.getByRole('button', { name: 'Login'}).click();
  // await page.context().storageState({ path: './auth/auth.json' });

  // Cleanup
  await browser.close();
}