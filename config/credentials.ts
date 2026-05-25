function required(
  value: string | undefined,
  name: string
): string {

  if (!value) {
    throw new Error(
      `Missing env variable: ${name}`
    );
  }
  return value;
}

export const credentials = {

  standard: {

    username: required(
      process.env.USER_STANDARD,
      'USER_STANDARD'
    ),

    password: required(
      process.env.PASSWORD_STANDARD,
      'PASSWORD_STANDARD'
    )
  }
};