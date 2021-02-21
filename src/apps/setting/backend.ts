import * as Koa from 'koa';
import { EventEmitter } from 'events';

export async function settingRoute(
  ctx: Koa.BaseContext, next: () => Promise<unknown>
): Promise<any> {
  await next();
}

export async function settingSocket(ctx, emitter: EventEmitter) {
}
