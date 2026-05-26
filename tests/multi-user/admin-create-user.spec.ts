import {  test,  expect } from '@fixtures/admin.fixture';

test.describe(
  'Admin Workflow',  () => {

  test(
    'admin can access secure area',   
     async ({ adminPage }) => {
      await expect(adminPage).toHaveURL(/secure/);
    });
});