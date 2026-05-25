export function logStep(
  message: string
) {

  console.log(
    `[${new Date().toISOString()}]
    ${message}`
  );

}