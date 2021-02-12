import * as Koa from 'koa';

export async function databaseRoute(
  ctx: Koa.BaseContext,
  next: () => Promise<unknown>
) {
  switch (ctx.path) {
    default:
      await next();
  }
}