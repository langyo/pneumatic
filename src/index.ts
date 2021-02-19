import { createServer } from 'http';
import { EventEmitter } from 'events';
import * as Koa from 'koa';
import * as ws from 'ws';
import * as bodyParserMiddleware from 'koa-bodyparser';

import {
  authLoginMiddleware, verifyConnection, terminateConnection
} from './utils/backend/authVerifyMiddleware';
import {
  clientSideMiddleware, serverSideMiddleware, serverSideLongtermMiddleware
} from './webpack';
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
    let emitters: { [id: string]: EventEmitter } = {};

    ws.on('message', (msg: string) => {
      try {
        const { head, data } = JSON.parse(msg);
        log('info', `Ws(${ip}):`, head);
        if (head === '#init') {
          const { id, pkg } = data;
          if (!serverSideLongtermMiddleware[pkg]) {
            throw Error(`Unknown package: '${pkg}'`);
          }
          if (emitters[id]) {
            ws.send(JSON.stringify({
              head: '#init', data: { status: 'fail', id }
            }));
            return;
          }
          emitters[id] = new EventEmitter();
          emitters[id].on('send', (msg: any) => {
            ws.send(JSON.stringify({ head: id, data: msg }));
          });
          ws.send(JSON.stringify({
            head: '#init', data: { status: 'success', id }
          }));
          serverSideLongtermMiddleware[pkg](req, emitters[id]);
        } else if (head === '#destory') {
          const { id } = data;
          if (!emitters[id]) {
            ws.send(JSON.stringify({
              head: '#destory', data: { status: 'fail', id }
            }));
            return;
          }
          emitters[id].emit('close');
          ws.send(JSON.stringify({
            head: '#destory', data: { status: 'success', id }
          }));
        } else {
          if (!emitters[head]) {
            ws.send(JSON.stringify({
              head: '#error', data: { msg: `Unknown entity '${head}'.` }
            }));
          }
          emitters[head].emit('message', data);
        }
      } catch (e) {
        ws.send(JSON.stringify({
          head: '#error', data: { msg: `${e}` }
        }));
      }
    });

    ws.on('close', () => {
      terminateConnection(token);
    });
  } else {
    log('warn', `Invalid connection(${ip}):`, token);
    ws.terminate();
  }
});
