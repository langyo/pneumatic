import * as Koa from 'koa';
import { EventEmitter } from 'events';
import { log } from './utils/backend/logger';

declare global {
  function exportMiddleware(
    middlewares: ((ctx: Koa.BaseContext, next: () => Promise<void>) => Promise<void>)[]
  ): void;
  function exportLongtermMiddleware(
    middlewareMap: { [pkg: string]: (ctx, emitter: EventEmitter) => Promise<void> }
  ): void;
};

const entryMap = require('./id.ts').entryMap;
let routes: {
  [pkg: string]: (ctx: Koa.BaseContext, next: () => Promise<unknown>) => Promise<any>
} = {};
let sockets: {
  [pkg: string]: (ctx, emitter: EventEmitter) => Promise<void>
} = {};
for (const pkg of Object.keys(entryMap)) {
  const { route, socket } = entryMap[pkg];
  if (route) {
    routes[pkg] = route;
  }
  if (socket) {
    sockets[pkg] = socket;
  }
}

exportMiddleware(Object.keys(routes).map(key => routes[key]));

exportLongtermMiddleware(sockets);

log('info', 'Server is ready.');
