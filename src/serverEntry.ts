import * as Koa from 'koa';
import { EventEmitter } from 'events';

import { config } from './utils/backend/configLoader';
import { log } from './utils/backend/logger';

declare global {
  function exportMiddleware(
    middlewares: ((ctx: Koa.BaseContext, next: () => Promise<void>) => Promise<void>)[]
  ): void;
  function socketReceiveStatic(head: string, callback: (token: string, data: any) => void): void;
  function socketReceive(callback: (token: string, head: string, data: any) => void);
  function socketSend(token: string, head: string, data: any): void;
};

const entryMap = require('./id.ts').entryMap;
let routes: {
  [pkg: string]: (ctx: Koa.BaseContext, next: () => Promise<unknown>) => Promise<any>
} = {};
let sockets: {
  [pkg: string]: (token: string, data: any, utils: {
    send: (data: { [key: string]: any }) => void,
    registerAutoSender: (timeout: number, callback: () => ({ [key: string]: any })) => void
  }) => Promise<void>
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

let activeSocketsMap: {
  [token: string]: {
    [id: string]: {
      pkg: string,
      autoSender: NodeJS.Timeout[],
      data: any
    }
  }
} = {};

socketReceiveStatic('#init', (token, { id, pkg, initState }) => {
  if (!activeSocketsMap[token]) {
    activeSocketsMap[token] = {};
  }
  activeSocketsMap[token][id] = {
    pkg, autoSender: [], data: initState || {}
  };
  socketSend(token, '#init', { status: 'success', id });
});

socketReceiveStatic('#destory', (token, { id }) => {
  if (activeSocketsMap[token] && activeSocketsMap[token][id]) {
    for (const timeoutObj of activeSocketsMap[token][id].autoSender) {
      clearTimeout(timeoutObj);
    }
    delete activeSocketsMap[token][id];
    socketSend(token, '#destory', { status: 'success', id });
  } else {
    socketSend(token, '#destory', { status: 'fail', id });
  }
});

socketReceiveStatic('#get-applications', (token, _data) => {
  socketSend(token, '#get-applications', { apps: config.applications })
});

socketReceive((token, head, data) => {
  if (activeSocketsMap[token] && activeSocketsMap[token][head]) {
    if (!sockets[activeSocketsMap[token][head].pkg]) {
      socketSend(token, '#error', { msg: `Unknown entity '${head}'` });
    }
    // TODO - Let the function be called once, or call another function.
    sockets[activeSocketsMap[token][head].pkg](token, data, {
      send: data => socketSend(token, head, data),
      registerAutoSender: (timeout, callback) => {
        activeSocketsMap[token][head].autoSender.push(
          setTimeout(() => socketSend(token, head, callback()), timeout)
        );
      }
    });
  } else {
    socketSend(token, '#error', { msg: `Unknown entity '${head}'` });
  }
});

log('info', 'Server is ready.');
