import { APIRequestContext } from '@playwright/test';

export async function createUserAPI( request: APIRequestContext,
  user: {
    name: string;
    job: string;
  }
) {

  return request.post( 'https://reqres.in/api/users',
    {
      data: user
    }
  );
}