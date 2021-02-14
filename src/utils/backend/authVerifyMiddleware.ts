import * as Koa from 'koa';
import { v4 as uuidGenerator } from 'uuid';

interface IAuthToken {
  key: string,
  birth: Date,
  lastUse: Date,
  userId: number
}

let authTokenList = [];

export async function authLoginMiddleware(
  ctx: Koa.BaseContext,
  next: () => Promise<unknown>
) {
  switch (ctx.accepts('json')) {
    case 'json':
      break;
    default:
      ctx.throw(406, 'Json only.');
  }
}

export async function authVerify(middleware: (
  ctx: Koa.BaseContext,
  next: () => Promise<unknown>
) => void) {
  return (
    ctx: Koa.BaseContext,
    next: () => Promise<unknown>
  ) => {
    
  }
}