import * as Koa from 'koa';

export async function browserRoute(
  ctx: Koa.BaseContext,
  next: () => Promise<unknown>
) {
  switch (ctx.path) {
    default:
      await next();
  }
}