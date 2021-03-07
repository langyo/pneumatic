import { createServer } from 'http';
import { EventEmitter } from 'events';
import * as Koa from 'koa';
import * as ws from 'ws';
import * as bodyParserMiddleware from 'koa-bodyparser';

import {
  authLoginMiddleware, verifyConnection, terminateConnection
} from './utils/backend/authVerifyMiddleware';
import {
  clientSideMiddleware, serverRoutes, serverSocketListeners
} from './webpack';
import { log } from './utils/backend/logger';
import { config } from './utils/backend/configLoader';

const app = new Koa();
app.use(bodyParserMiddleware());
app.use(authLoginMiddleware('/backend/login'));
app.use(async (
  ctx: Koa.BaseContext,
  next: () => Promise<void>
) => {
  log('info', `Http(${ctx.ip}):`, ctx.path);
  await serverRoutes(ctx, async () => {
    await clientSideMiddleware(ctx, next);
  });
});

const server = createServer(app.callback()).listen(
  process.env.PORT && +process.env.PORT || 80,
  process.env.HOST || undefined
);

let socketSendMiddleware: {
  [token: string]: (head: string, data: any) => void
} = {};
export function socketSend(token: string, head: string, data: any) {
  if (socketSendMiddleware[token]) {
    socketSendMiddleware[token](head, data);
  }
}

const wss = new ws.Server({ server });
wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  const token = req.url.substr(1);

  if (verifyConnection(token)) {
    log('info', `New Ws connection(${ip}):`, token);
    socketSendMiddleware[token] = (head, data) => ws.send(JSON.stringify({ head, data }));
    ws.on('message', (msg: string) => {
      try {
        const { head, data } = JSON.parse(msg);
        log('info', `Ws(${ip}):`, head);
        serverSocketListeners[head](token, data);
      } catch (e) {
        log('error', e);
        ws.send(JSON.stringify({
          head: '#error', data: { msg: `${e}` }
        }));
      }
    });

    ws.on('close', () => {
      serverSocketListeners['#destory-all'](token, {});
      terminateConnection(token);
    });
  } else {
    log('warn', `Invalid connection(${ip}):`, token);
    ws.terminate();
  }
});
