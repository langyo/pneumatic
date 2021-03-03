import { EventEmitter } from 'events';

import { freemem, totalmem } from 'os';

export async function socket(ctx, emitter: EventEmitter) {
  let timeoutObj = setInterval(() => {
    emitter.emit('send', {
      freeMem: freemem(), totalMem: totalmem()
    });
  }, 1000);
  emitter.on('close', () => {
    clearInterval(timeoutObj);
  });
}
