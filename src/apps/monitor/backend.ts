import * as Koa from 'koa';
import { EventEmitter } from 'events';

import { freemem, totalmem, cpus } from 'os';

export async function monitorRoute(
  ctx: Koa.BaseContext, next: () => Promise<unknown>
): Promise<any> {
  await next();
}

export async function monitorSocket(ctx, emitter: EventEmitter) {
  let timeoutObj = setInterval(() => {
    emitter.emit('send', {
      freeMem: freemem(), totalMem: totalmem()
    });
  }, 1000);
  emitter.on('close', () => {
    clearInterval(timeoutObj);
  });
}
