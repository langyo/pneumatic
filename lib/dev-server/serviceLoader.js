import { parentCreator } from './childProcessCreator';
import middlewareRelay from './middlewareRelay';
import webpackLoader from './webpackLoader';

import { serverLog as log } from '../utils/logger';
import { resolve } from 'path';

export default ({
  workDirPath,
  clientRenderFileName = 'clientRender.js',
  serverRenderFileName = 'services.js'
}) => {
  const webpackClientSide = webpackLoader({
    webpackConfig: {
      entry: resolve(workDirPath, './clientRender.js'),

      output: {
        path: resolve(workDirPath, './dist/'),
        filename: clientRenderFileName
      },
      target: 'web'
    },
    defaultDirPath: resolve(workDirPath, './dist/')
  });
  webpackClientSide.once('ready', () => {
    log('info', `Webpack has been compiled the static file.`);
  });
  webpackClientSide.on('change', () => {
    log('info', `Webpack has been compiled the static file.`);
  });

  const webpackServerSide = webpackLoader({
    webpackConfig: {
      entry: resolve(workDirPath, './services.js'),

      output: {
        path: resolve(workDirPath, './dist/'),
        filename: serverRenderFileName
      },
      target: 'node'
    },
    defaultDirPath: resolve(workDirPath, './dist/')
  });

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
