import * as Koa from 'koa';
import { EventEmitter } from 'events';

export async function terminalRoute(
  ctx: Koa.BaseContext, next: () => Promise<unknown>
): Promise<any> {
  await next();
}

export async function terminalSocket(ctx, emitter: EventEmitter) {
}
