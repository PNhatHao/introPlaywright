export function createUser() {

  const uniqueId  =    Date.now();

  return {
    username: `user-${uniqueId}`,
    email: `user-${uniqueId}@gmail.com`,
    password: 'Password123!'
  };
}