import * as Koa from 'koa';
import { EventEmitter } from 'events';

export async function marketRoute(
  ctx: Koa.BaseContext, next: () => Promise<unknown>
): Promise<any> {
  await next();
}

export async function marketSocket(ctx, emitter: EventEmitter) {
}