import * as Koa from 'koa';
import { v4 as generateUUID } from 'uuid';
import { accounts } from './configLoader';
import { log } from './logger';

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
        ctx.body = JSON.stringify({ status: 'success', token });
      } else {
        ctx.body = JSON.stringify({ status: 'fail' });
      }
    }
  } else {
    await next();
  }
}

export function connectionVerify(token: string): boolean {
  if (typeof connectionList[token] !== 'boolean') {
    connectionList[token].lastConnect = new Date();
    return true;
  } else {
    return false;
  }
}

// Clean up invalid connections regularly.
// Check every 1 mins.
setInterval(() => {
  let count = 0;
  for (const token of Object.keys(connectionList)) {
    if (connectionList[token].lastConnect.getTime() - Date.now() >= 10 * 60 * 1000) {
      delete connectionList[token];
      count += 1;
    }
  }
  log('info', `${count} token${count > 1 ? 's' : ''} cleaned up.`);
}, 60 * 1000);
