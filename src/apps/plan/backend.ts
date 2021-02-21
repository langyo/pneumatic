import * as Koa from 'koa';
import { EventEmitter } from 'events';

export async function planRoute(
  ctx: Koa.BaseContext, next: () => Promise<unknown>
): Promise<any> {
  await next();
}

export async function planSocket(ctx, emitter: EventEmitter) {
}
