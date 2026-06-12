export function createFakeUser () {

  const uniqueId  = Date.now();

  return {
    name: `user-${uniqueId}`,
    job: 'automation engineer',
    email: `user-${uniqueId}@gmail.com`,
    // password: 'Password123!'
  };
}