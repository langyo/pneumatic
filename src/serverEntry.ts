import * as Koa from 'koa';

import { log } from './utils/backend/logger';
import { IAppComponent, IAppDefaultInfo } from './utils/frontend/appProviderContext';

declare global {
  function exportMiddleware(
    middlewares: ((ctx: Koa.Context, next: () => Promise<void>) => Promise<void>)[]
  ): void;
  function socketReceive(head: string, callback: (token: string, data: any) => void): void;
  function socketSend(token: string, head: string, data: any): void;
};

const entryMap: {
  [pkg: string]: {
    pages?: {
      [page: string]: IAppComponent
    },
    config?: {
      defaultInfo?: IAppDefaultInfo
    },
    name: string,
    icon: string,
    id: string,

    route?: (ctx: Koa.Context, next: () => Promise<unknown>) => Promise<any>,
    socket?: (token: string, data: { [key: string]: any }, utils: {
      send: (data: { [key: string]: any }) => void,
      registerAutoSender: (timeout: number, callback: () => ({ [key: string]: any })) => void
    }) => Promise<void>
  }
} = require('./__server_id.ts').entryMap;

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

socketReceive('#init', (token, { id, pkg, page, initState }) => {
  if (!activeSocketsMap[token]) {
    activeSocketsMap[token] = {};
  }
  activeSocketsMap[token][id] = {
    pkg, autoSender: [], data: initState || {}
  };

  let {
    page: defaultPage, state: defaultStateGenerator, windowInfo: defaultWindowInfoGenerator
  } = entryMap[pkg]?.config?.defaultInfo || {};
  const sharedState = {
    ...(initState || {}),
    ...(defaultStateGenerator ? defaultStateGenerator(page, initState) : {})
  };

  socketSend(token, '#init', {
    status: 'success', id, pkg,
    page: page || defaultPage || 'default',
    sharedState,
    windowInfo: defaultWindowInfoGenerator && Object.keys(
      defaultWindowInfoGenerator
    ).reduce((obj, key) => ({
      ...obj,
      [key]: defaultWindowInfoGenerator[key](page, sharedState)
    }), {}) || {}
  });
  if (entryMap[pkg].socket) {
    entryMap[pkg].socket(token, sharedState, {
      send: data => socketSend(token, '#set-shared-state', { id, data }),
      registerAutoSender: (timeout, callback) => {
        activeSocketsMap[token][id].autoSender.push(
          setInterval(() => socketSend(token, '#set-shared-state', {
            id, data: callback()
          }), timeout)
        );
      }
    }).catch(e => {
      log('error', e);
      console.error(e);
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

socketReceive('#destory-all', (token, _data) => {
  if (activeSocketsMap[token]) {
    for (const id of Object.keys(activeSocketsMap[token])) {
      for (const timeoutObj of activeSocketsMap[token][id].autoSender) {
        clearInterval(timeoutObj);
      }
    }
  }
});

socketReceive('#restart', (_token, _data) => {
  for (const token of Object.keys(activeSocketsMap)) {
    for (const id of Object.keys(activeSocketsMap[token])) {
      for (const timeoutObj of activeSocketsMap[token][id].autoSender) {
        clearInterval(timeoutObj);
      }
    }
  }
})

socketReceive('#get-apps', (token, _data) => {
  socketSend(token, '#get-apps', {
    apps: Object.keys(entryMap).reduce((obj, name) => ({
      ...obj,
      [name]: ['name', 'icon', 'id'].reduce((obj, key) => ({
        ...obj,
        [key]: entryMap[name][key]
      }), {})
    }), {})
  })
});

socketReceive('#set-shared-state', (token, { id, data }) => {
  if (!entryMap[activeSocketsMap[token][id].pkg].socket) {
    socketSend(token, '#error', { msg: `Unknown entity '${id}'` });
  }
  entryMap[activeSocketsMap[token][id].pkg].socket(token, data, {
    send: data => socketSend(token, '#set-shared-state', { id, data }),
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

