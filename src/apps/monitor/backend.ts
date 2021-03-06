import { freemem, totalmem } from 'os';

export async function socket(_token, _data, { registerAutoSender }) {
  registerAutoSender(1000, () => {
    return {
      freeMem: freemem(), totalMem: totalmem()
    };
  });
}
