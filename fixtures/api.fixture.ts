import { test as base } from '@playwright/test';

class APIClient { async getUser() {
    return {
      id: 1,
      name: 'Tom'
    };
  }
}

type ApiFixtures = {  apiClient: APIClient;
};

export const test = base.extend<ApiFixtures>({
    apiClient:
      async ({}, use) => {
        const apiClient = new APIClient();
        await use(apiClient);
      }
  });

export { expect } from '@playwright/test';