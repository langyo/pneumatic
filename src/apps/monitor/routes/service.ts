import * as Koa from 'koa';
import { EventEmitter } from 'events';

export async function monitorRoute(
  ctx: Koa.BaseContext, next: () => Promise<unknown>
): Promise<any> {
  await next();
}

export async function monitorSocket(ctx, emitter: EventEmitter) {
}
