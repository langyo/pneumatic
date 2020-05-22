import { parentCreator } from './childProcessCreator';
import middlewareRelay from './middlewareRelay';
import { loader as webpackLoader } from './webpackLoader';
import dirWatcher from './dirWatcher';

import { serverLog as log } from '../utils/logger';
import { resolve } from 'path';

export default ({
  workDirPath,
  clientRenderFileName,
  serverRenderFileName
}) => {
  const watcher = dirWatcher({ workDirPath });

  const webpackClientSide = webpackLoader({
    entry: resolve(__dirname, './defaultClientLoader.js'),
    target: 'web'
  }, watcher);
  webpackClientSide.once('ready', content => {
    log('info', `Webpack has been compiled the static file.`, content.length);
  });
  webpackClientSide.on('change', content => {
    log('info', `Webpack has been compiled the static file.`);
  });

  const webpackServerSide = webpackLoader({
    entry: resolve(__dirname, './defaultServerLoader.js'),
    target: 'node'
  }, watcher);

  return new Promise(resolveFunc => webpackServerSide.once('ready', () => {
    log('info', `The server has ready.`);
    const { send, restart } = parentCreator(resolve('./dist/services.js'));
    webpackServerSide.on('change', () => {
      log('info', `Restarting services.`);
      restart();
    });
    resolveFunc(middlewareRelay({
      sendFunc: send,
      renderFilePath: resolve(workDirPath, './dist/clientRender.js')
    }));
  }));
};
