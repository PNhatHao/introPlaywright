import { chromium, FullConfig, expect } from '@playwright/test';
import { LoginPage }  from '@pages/LoginPage';
import { credentials } from '@config/credentials';

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
  // Perform login
  await loginPage.login(
          credentials.standard.username,     // 'tomsmith',      await page.getByLabel('Username').fill(credentials.standard.username);
          credentials.standard.password      // 'SuperSecretPassword!'        await page.getByLabel('Password').fill(credentials.standard.password);
  );
  // Verify successful login
  await expect(page).toHaveURL(/secure/);
  // Save authenticated state
  await context.storageState({path: 'auth/auth.json'});
  // Cleanup
  await browser.close();
}
// export default async function globalSetup(
//   config: FullConfig
// ) {
//   const browser = await chromium.launch();
//   const page =await browser.newPage();
//   await page.goto(  'https://the-internet.herokuapp.com/login' );
//   await page.getByLabel('Username').fill(credentials.standard.username);
//   await page.getByLabel('Password').fill(credentials.standard.password);
//   await page.getByRole('button', {name: 'Login'}).click();
//   await page.context().storageState({ path: 'auth/auth.json'});
//   await browser.close();
// }