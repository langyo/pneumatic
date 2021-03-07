import { freemem, totalmem } from 'os';

export async function socketAutoRun(_token, { registerAutoSender }) {
  registerAutoSender(1000, () => {
    return {
      freeMem: freemem(), totalMem: totalmem()
    };
  });
}
