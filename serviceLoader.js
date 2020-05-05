import {
  parentCreator,
  webpackLoader,
  middlewareRelay
} from './lib/server';

import { serverLog as log } from './lib/utils/logger';
import { resolve } from 'path';

const webpackServerSide = webpackLoader({
  webpackConfig: {
    entry: resolve('./services.js'),

    output: {
      path: resolve('./dist/'),
      filename: 'services.js'
    },
    target: 'node'
  },
  defaultDirPath: './dist'
});

export default new Promise(resolveFunc => webpackServerSide.once('ready', () => {
  log('info', `The server has ready.`);
  const { send, restart } = parentCreator(resolve('./dist/services.js'));
  webpackServerSide.on('change', () => {
    log('info', `Restarting services.`);
    restart();
  });
  resolveFunc(middlewareRelay({ sendFunc: send }));
}));

const webpackClientSide = webpackLoader({
  webpackConfig: {
    entry: resolve('./renderSPA.js'),

    output: {
      path: resolve('./dist/'),
      filename: 'renderSPA.js'
    },
    target: 'web'
  },
  defaultDirPath: './dist/'
});
webpackClientSide.once('ready', () => {
  log('info', `Webpack has been compiled the static file.`);
});
webpackClientSide.on('change', () => {
  log('info', `Webpack has been compiled the static file.`);
});