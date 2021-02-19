import * as Koa from 'koa';
import { EventEmitter } from 'events';

export async function explorerRoute(
  ctx: Koa.BaseContext, next: () => Promise<unknown>
): Promise<any> {
  await next();
}

export async function explorerSocket(ctx, emitter: EventEmitter) {
}
