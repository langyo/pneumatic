import { readFileSync, writeFileSync } from 'fs';

export const config = new Proxy({}, {
  get(_target, key, receiver) {
    return;
  },
  set(_target, key, value, receiver) {
    return true;
  }
});
