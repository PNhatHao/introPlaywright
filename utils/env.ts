import * as dotenv from 'dotenv';

const environment =
  process.env.ENV || 'local';

dotenv.config({
  path: `./env/.env.${environment}`
});
console.log('[ENV]',environment);
//console.log('USER_STANDARD:',process.env.USER_STANDARD) // Debug Day 6;