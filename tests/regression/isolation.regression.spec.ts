import { test, expect } from '@fixtures/auth.fixture';

test.describe(
  'Isolation Verification',  () => {

  test(  'test A isolated', async ({ loggedInPage }) => {
      await expect(
        loggedInPage
      ).toHaveURL(/secure/);

    });

  test(   'test B isolated', async ({ loggedInPage }) => {

      await expect(
        loggedInPage
      ).toHaveURL(/secure/);

    });

});