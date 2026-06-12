import { expect } from '@playwright/test';

export function validateUserContract(
  body: any
) {
  expect(body).toHaveProperty('id');
  expect(body).toHaveProperty('createdAt');
}