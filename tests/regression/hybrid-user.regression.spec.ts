import { test, expect } from '@playwright/test';
import { createUserAPI } from '../../api/user.api';
import { validateUserContract } from '@helpers/response-validator';
import { createFakeUser } from '@test-data/factories/user.factory';

test.describe(
  'Hybrid UI/API Flow', () => {

  test(
    'create user via API then validate response',
    async ({ request, page }) => {

      const user =
        createFakeUser();

      const response =
        await createUserAPI(request,
          {
            name: user.name,
            job: user.job
          }
        );

      expect(response.ok())
        .toBeTruthy();

      const body =
        await response.json();

      validateUserContract(body);

      expect(body.name)
        .toBe(user.name);

      expect(body.job)
        .toBe(user.job);

      // UI validation example
      await page.goto('/login');

      await expect(
        page.getByRole('heading', {
          name: 'Login Page'
        })
      ).toBeVisible();

    });

});