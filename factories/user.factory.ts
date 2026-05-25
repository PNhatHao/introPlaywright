export function createRandomUser() {

  const randomId =    Date.now();

  return {
    username:      `user-${randomId}`,
    email:      `user-${randomId}@test.com`,
    password:      'Password123!'
  };
}