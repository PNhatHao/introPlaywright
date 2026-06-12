import { APIRequestContext } from '@playwright/test';

export class APIClient {

  constructor(
    private request:
      APIRequestContext
  ) {}

  async get( url: string) {
    return this.request.get(url);
  }

  async post(
    url: string,
    data: any
  ) {

    return this.request.post(  url,
      { data }
    );
  }
}