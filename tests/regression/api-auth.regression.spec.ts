import { test, expect } from '@fixtures/api.fixture';

test.describe(
  'API Authentication',
  () => {

  test(
    'should return valid token',
    async ({ apiToken }) => {

      expect(apiToken)
        .toBeTruthy();

      expect(typeof apiToken)
        .toBe('string');

    });

});