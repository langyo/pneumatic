import { Keccak } from 'sha3';

export function signSaltPassword(userName: string, rawPassword: string) {
  const shaObj = new Keccak(512);
  shaObj.update('pneumatic').update(userName).update(rawPassword);
  return shaObj.digest('hex');
}
