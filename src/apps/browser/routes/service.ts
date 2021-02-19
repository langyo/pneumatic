import * as Koa from 'koa';
import { EventEmitter } from 'events';

export async function browserRoute(
  ctx: Koa.BaseContext, next: () => Promise<unknown>
): Promise<any> {
  await next();
}

export async function browserSocket(ctx, emitter: EventEmitter) {
}
