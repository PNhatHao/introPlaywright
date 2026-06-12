import { test as base } from '@playwright/test';
import { loginAPI } from '@api/auth.api';

// class APIClient { async getUser() {
//     return {
//       id: 1,
//       name: 'Tom'
//     };
//   }
// }

type ApiFixtures = {  apiToken: string; };

export const test = base.extend<ApiFixtures>({
    apiToken:
      async ({request}, use) => {
        const response = await loginAPI(request);
        const body = await response.json();
        //const { token } = body;
        await use(body.token);
      }
  });

export { expect } from '@playwright/test';