import { Page }from '@playwright/test';

export async function loginAs(

  page: Page,
  username: string,
  password: string

) {
  await page.goto('/login');
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', {
    name: 'Login'
  }).click();

}