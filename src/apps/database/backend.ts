import * as Koa from 'koa';
import { EventEmitter } from 'events';

export async function databaseRoute(
  ctx: Koa.BaseContext, next: () => Promise<unknown>
): Promise<any> {
  await next();
}

export async function databaseSocket(ctx, emitter: EventEmitter) {
}
