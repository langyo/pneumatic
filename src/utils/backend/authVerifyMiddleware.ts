import * as Koa from 'koa';
import { v4 as generateUUID } from 'uuid';
import { config } from './configLoader';
import { log } from './logger';

interface IConnection {
  birth: Date,
  lastConnect: Date,
  ip: string,
  userName: string
}

let connections: { [token: string]: IConnection } = {};

export function authLoginMiddleware(path: string) {
  return async (
    ctx: Koa.BaseContext,
    next: () => Promise<unknown>
  ) => {
    if (ctx.path === path) {
      if (ctx.accepts('json') !== 'json') {
        ctx.throw(406, 'Json only.');
      } else {
        const { userName, signedPassword } = ctx.request.body;
        if (config.accounts[userName] && config.accounts[userName] === signedPassword) {
          const token = generateUUID();
          connections[token] = {
            birth: new Date(),
            lastConnect: new Date(),
            ip: ctx.ip,
            userName: userName
          };
          ctx.body = JSON.stringify({ status: 'success', token });
          log('info', `Login success(${ctx.ip}):`, userName);
        } else {
          ctx.body = JSON.stringify({ status: 'fail' });
          log('warn', `Login fail(${ctx.ip}):`, userName);
        }
      }
    } else {
      await next();
    }
  }
}

export function verifyConnection(token: string): boolean {
  if (
    connections[token] &&
    connections[token].lastConnect.getTime() - Date.now() < 10 * 60 * 1000
  ) {
    connections[token].lastConnect = new Date();
    return true;
  } else {
    return false;
  }
}

export function terminateConnection(token: string) {
  log('info', `Closed connection(${connections[token].ip}):`, token);
  delete connections[token];
}
