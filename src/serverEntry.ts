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

const entryMap: {
  [pkg: string]: {
    route?: (ctx: Koa.BaseContext, next: () => Promise<unknown>) => Promise<any>,
    socket?: (token: string, data: any, utils: {
      send: (data: { [key: string]: any }) => void,
      registerAutoSender: (timeout: number, callback: () => ({ [key: string]: any })) => void
    }) => Promise<void>,
    socketAutoSender?: (token: string, utils: {
      send: (data: { [key: string]: any }) => void,
      registerAutoSender: (timeout: number, callback: () => ({ [key: string]: any })) => void
    }) => Promise<void>
  }
} = require('./id.ts').entryMap;

exportMiddleware(Object.keys(entryMap).map(key => entryMap[key].route).filter(n => !!n));

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
  if (entryMap[pkg].socketAutoSender) {
    entryMap[pkg].socketAutoSender(token, {
      send: data => socketSend(token, id, data),
      registerAutoSender: (timeout, callback) => {
        activeSocketsMap[token][id].autoSender.push(
          setInterval(() => socketSend(token, id, callback()), timeout)
        );
      }
    });
  }
});

socketReceiveStatic('#destory', (token, { id }) => {
  if (activeSocketsMap[token] && activeSocketsMap[token][id]) {
    for (const timeoutObj of activeSocketsMap[token][id].autoSender) {
      clearInterval(timeoutObj);
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
    if (!entryMap[activeSocketsMap[token][head].pkg].socket) {
      socketSend(token, '#error', { msg: `Unknown entity '${head}'` });
    }
    entryMap[activeSocketsMap[token][head].pkg].socket(token, data, {
      send: data => socketSend(token, head, data),
      registerAutoSender: (timeout, callback) => {
        activeSocketsMap[token][head].autoSender.push(
          setInterval(() => socketSend(token, head, callback()), timeout)
        );
      }
    });
  } else {
    socketSend(token, '#error', { msg: `Unknown entity '${head}'` });
  }
});

log('info', 'Server is ready.');
