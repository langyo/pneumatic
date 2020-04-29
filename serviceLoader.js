import {
  parentCreator,
  webpackLoader,
  middlewareRelay
} from './lib/server';

import chalk from 'chalk';
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
  const now = (new Date()).toLocaleTimeString();
  console.log(`${chalk.yellow(now)} ${chalk.blue('INFO')} The server has ready.`);
  const { send, restart } = parentCreator(resolve('./dist/services.js'));
  webpackServerSide.on('change', () => {
    const now = (new Date()).toLocaleTimeString();
    console.log(`${chalk.yellow(now)} ${chalk.blue('INFO')} Restarting server.`);
    restart();
  });
  resolveFunc(middlewareRelay(send, 'koa'));
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
  const now = (new Date()).toLocaleTimeString();
  console.log(`${chalk.yellow(now)} ${chalk.blue('INFO')} Webpack has been compiled the static file. (renderSPA)`);
});
webpackClientSide.on('change', () => {
  const now = (new Date()).toLocaleTimeString();
  console.log(`${chalk.yellow(now)} ${chalk.blue('INFO')} Webpack has been compiled the static file. (renderSPA)`);
});