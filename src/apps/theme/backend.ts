import * as Koa from 'koa';
import { EventEmitter } from 'events';

export async function themeRoute(
  ctx: Koa.BaseContext, next: () => Promise<unknown>
): Promise<any> {
  await next();
}

export async function themeSocket(ctx, emitter: EventEmitter) {
}
