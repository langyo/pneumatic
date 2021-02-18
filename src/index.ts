import { createServer } from 'http';
import * as Koa from 'koa';
import * as ws from 'ws';
import * as bodyParserMiddleware from 'koa-bodyparser';

import {
  authLoginMiddleware, verifyConnection, terminateConnection
} from './utils/backend/authVerifyMiddleware';
import { clientSideMiddleware, serverSideMiddleware } from './webpack';
import { log } from './utils/backend/logger';

const app = new Koa();
app.use(bodyParserMiddleware());
app.use(authLoginMiddleware('/backend/login'));
app.use(async (
  ctx: Koa.BaseContext,
  next: () => Promise<void>
) => {
  log('info', `Http(${ctx.ip}):`, ctx.path);
  await serverSideMiddleware(ctx, async () => {
    await clientSideMiddleware(ctx, next);
  });
});

const server = createServer(app.callback()).listen(
  process.env.PORT && +process.env.PORT || 80,
  process.env.HOST || undefined
);

const wss = new ws.Server({ server });
wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  const token = req.url.substr(1);

  if (verifyConnection(token)) {
    log('info', `New Ws connection(${ip}):`, token);

    ws.on('message', (msg: string) => {
      log('info', `Ws(${ip}):`, msg);
    });
    ws.send('test');

    ws.on('close', () => {
      terminateConnection(token);
    });
  } else {
    log('warn', `Invalid connection(${ip}):`, token);
    ws.terminate();
  }
});
