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
import merge from '../utils/deepMerge';

let routes = {};

const createRoutes = ({
  tasks,
  path
}, extraArgs) => {
  for (let i = 1; i < tasks.length; ++i) {
    if (!Array.isArray(tasks[i])) {
      if (tasks[i].$$static) {
        const route = getServerActionExecutor(tasks[i].$$type)({
          /* context */
          execChildStream: payload => createStream({ tasks: tasks[i].$$static, path })(payload)
        });

        log('info', `Parsed the static route: ${path}[${i}]`);
        routes = merge(routes, route);
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
  // Normal actions
  for (let modelType of getModelList()) {
    createRoutes({ tasks: getServerStream(modelType), path: modelType });
  }
  // Page routes
  for (let modelType of getModelList()) {
    if (!routes.http) routes.http = {};
    routes.http[`/${modelType}`] = ({ ip, path, query, host, charset, protocol, type, staticClientPath }) => {
      const body = `
    <html>
    <head>
    <title>Demo Page</title>
    <style>
    body {
    padding: 0px;
    margin: 0px;
    }
    </style>
    <meta name="viewport" id="viewport" content="width=device-width, initial-scale=1" />
    <style>${
        ''
        }</style>
    <head>
    <body>
    <div id="root">${
        ''
        }</div>
    <script>${
        ''
        }</script>
    <script src=${staticClientPath}></script>
    <script>
    ;(function () {
    var src = '//cdn.jsdelivr.net/npm/eruda';
    if (!/mobile_dev=true/.test(window.location)) return;
    document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
    document.write('<scr' + 'ipt>eruda.init();</scr' + 'ipt>');
    })();
    </script>
    </body>
    </html>`;

      return { type: 'text/html', body };
    };
  }

  log('debug', 'Routes: ', routes);
};

export { createRoutes };

export const getRoutes = () => routes;
