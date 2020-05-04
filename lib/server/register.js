import {
  getModelList,
  getServerStream,
  getPreloader
} from '../lib/modelStore';
import {
  getServerActionExecutor
} from '../lib/actionLoader';
import createStream from './createStream';

import { serverLog as log } from '../utils/logger';

let routes = {};

const createRoutes = ({
  tasks,
  path
}, extraArgs) => {
  for (let i = 1; i < tasks.length; ++i) {
    if (!Array.isArray(tasks[i])) {
      if (tasks[i].$$static) {
        const route = getServerActionExecutor(tasks[i].$$type)(payload => createStream({ tasks: tasks[i].$$static, path })(payload), { /* context */ });
        
        log('info', `Parsed the static route: ${path}[${i}]`);
        
        for (let i of Object.keys(route)) {
          if (!routes[i]) routes[i] = [];
          routes[i].push(route[i]);
        }
      }
    } else {
      createRoutes({
        tasks: tasks[i],
        path: `${path}[${i}]`
      }, extraArgs);
    }
  }
};

export const initRoutes = () => {
  for (let modelType of getModelList()) {
    createRoutes({ tasks: getServerStream(modelType), path: modelType });
  }
  log('debug', 'Routes: ', routes);
};

export { createRoutes };

export const getRoutes = () => routes;
