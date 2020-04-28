import { parentCreator } from './lib/server/childProcessCreator';
import webpackLoader from './lib/server/webpackLoader';
import middlewareRelay from './lib/server/middlewareRelay';

import chalk from 'chalk';
import { resolve } from 'path';

const webpackServerSide = webpackLoader({
  webpackConfig: {
    entry: resolve('./packages/services.js'),

    output: {
      path: resolve('./dist/'),
      filename: 'services.js'
    },
    target: 'node'
  },
  defaultDirPath: './dist'
});

export default new Promise(resolve => webpackServerSide.once('ready', () => {
  const { send, restart } = parentCreator('./dist/services.js');
  webpackServerSide.on('change', () => {
    restart();
  });
  resolve(middlewareRelay(send, 'koa'));
}));

const webpackClientSide = webpackLoader({
  webpackConfig: {
    entry: resolve('./packages/renderSPA.js'),

    output: {
      path: resolve('./dist/'),
      filename: 'renderSPA.js'
    },
    target: 'web'
  },
  defaultDirPath: './dist/'
});
webpackClientSide.once('ready', () => console.log('Client side ready.'));
webpackClientSide.on('change', () => console.log('Client side has been changed.'));