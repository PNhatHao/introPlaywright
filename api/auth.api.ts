import { APIRequestContext } from '@playwright/test';

export async function loginAPI(
  request: APIRequestContext ) {

  const response = await request.post( 'https://reqres.in/api/login',
      {
        data: {
          email: 'eve.holt@reqres.in',
          password: 'cityslicka'
        }
      }
    );

  return response;

}