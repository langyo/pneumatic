import * as Koa from 'koa';
import { v4 as generateUUID } from 'uuid';
import { accounts } from './configLoader';

interface IConnection {
  birth: Date,
  lastConnect: Date,
  user: string
}

let connectionList: { [token: string]: IConnection } = {};

export async function authLoginMiddleware(
  ctx: Koa.BaseContext,
  next: () => Promise<unknown>
) {
  if (ctx.path === '/backend/login') {
    if (ctx.accepts('json') !== 'json') {
      ctx.throw(406, 'Json only.');
    } else {
      const { userName, signedPassword } = ctx.request.body;
      if (accounts[userName] && accounts[userName] === signedPassword) {
        const token = generateUUID();
        connectionList[token] = {
          birth: new Date(),
          lastConnect: new Date(),
          user: userName
        };
        ctx.cookies.set('token', token, { overwrite: true });
        ctx.body = JSON.stringify({ status: 'success', token });
      } else {
        ctx.body = JSON.stringify({ status: 'fail' });
      }
    }
  } else {
    await next();
  }
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