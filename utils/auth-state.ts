import fs from 'fs';
export function authStateExists() {
  return fs.existsSync(
    './auth/auth.json'
  );
}