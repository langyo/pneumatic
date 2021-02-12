import * as Koa from 'koa';

export async function explorerRoute(
  ctx: Koa.BaseContext,
  next: () => Promise<unknown>
) {
  switch (ctx.path) {
    default:
      await next();
  }
}