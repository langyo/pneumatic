import {
  getModelList,
  getServerStream
} from '../lib/modelStore';
import {
  getServerActionExecutor
} from '../lib/actionLoader';
import createStream from './createStream';

import { serverLog as log } from '../utils/logger';
import merge from '../utils/deepMerge';
import htmlPageRender from './htmlPageRender';

let routes = {};

const createRoutes = ({
  streams,
  path
}, extraArgs) => {
  for (let streamName of Object.keys(streams)) {
    if (streamName[0] === '$') continue;
    for (let i = 1; i < streams[streamName].length; ++i) {
      if (!Array.isArray(streams[streamName][i])) {
        if (streams[streamName][i].$$static) {
          const route = getServerActionExecutor(streams[streamName][i].$$type)(streams[streamName][i])({
            /* context */
            execChildStream: (extraArgs = {}) => (...payload) => createStream({ tasks: [extraArgs, ...streams[streamName][i].$$static], path })(...payload)
          });
  
          log('info', `Parsed the static route: ${path}.${streamName}[${i}]`, route);
          routes = merge(routes, route);
        }
      } else {
        createRoutes({
          tasks: streams[streamName][i],
          path: `${path}.${streamName}[${i}]`
        }, extraArgs);
      }
    }
  }
};

export const initRoutes = ({
  rootPageRelay
}) => {
  // Normal actions
  for (let modelType of getModelList()) {
    createRoutes({ streams: getServerStream(modelType), path: modelType });
  }
  // Page routes
  for (let modelType of getModelList()) {
    if (!routes.http) routes.http = {};
    routes.http[`/${modelType}`] = htmlPageRender(modelType);
  }
  if (rootPageRelay) {
    log('debug', 'RouteRelay: ', rootPageRelay);
    if (getModelList().indexOf(rootPageRelay) < 0) log('warn', `Unknown root page's name: ${rootPageRelay}.`);
    else routes.http['/'] = htmlPageRender(rootPageRelay);
  }
  log('debug', 'Routes:', routes);
};

export { createRoutes };

export const getRoutes = () => routes;
