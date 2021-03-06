import * as Koa from 'koa';

import { config } from './utils/backend/configLoader';
import { log } from './utils/backend/logger';

declare global {
  function exportMiddleware(
    middlewares: ((ctx: Koa.BaseContext, next: () => Promise<void>) => Promise<void>)[]
  ): void;
  function socketReceive(head: string, callback: (token: string, data: any) => void): void;
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

socketReceive('#init', (token, { id, pkg, initState }) => {
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
          setInterval(() => socketSend(token, '#set-shared-state', {
            id, data: callback()
          }), timeout)
        );
      }
    });
  }
});

socketReceive('#destory', (token, { id }) => {
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

socketReceive('#get-applications', (token, _data) => {
  socketSend(token, '#get-applications', { apps: config.applications })
});

socketReceive('#set-shared-state', (token, { id, data }) => {
  if (!entryMap[activeSocketsMap[token][id].pkg].socket) {
    socketSend(token, '#error', { msg: `Unknown entity '${id}'` });
  }
  entryMap[activeSocketsMap[token][id].pkg].socket(token, data, {
    send: data => socketSend(token, '#set-shared-state', {
      id, data
    }),
    registerAutoSender: (timeout, callback) => {
      activeSocketsMap[token][id].autoSender.push(
        setInterval(() => socketSend(token, '#set-shared-state', {
          id, data: callback()
        }), timeout)
      );
    }
  });
});

log('info', 'Server is ready.');
