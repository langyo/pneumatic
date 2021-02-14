import * as Koa from 'koa';
import { v4 as uuidGenerator } from 'uuid';

interface IConnection {
  birth: Date,
  lastConnect: Date,
  user: 'guest' | number
}

let connectionList: { [token: string]: IConnection } = {};

export async function authLoginMiddleware(
  ctx: Koa.BaseContext,
  next: () => Promise<unknown>
) {
  await next();
}

export function authVerify(
  pkg: string,
  middleware: (path: string, { userId }: { userId: number }) => Promise<any>
): (ctx: Koa.BaseContext, next: () => Promise<unknown>) => Promise<void> {
  const path = pkg.split('.').join('/');
  return async function (ctx: Koa.BaseContext, next: () => Promise<unknown>) {
    if (ctx.url.substr(0, path.length) === path) {
      ctx.body = JSON.stringify(
        await middleware(ctx.url.substr(path.length), { userId: 0 })
      );
    } else {
      await next();
    }
  }
}