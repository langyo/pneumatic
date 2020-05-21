import webpack from 'webpack';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';

import { serverLog as log } from '../utils/logger';
import { resolve } from 'path';
import EventEmitter from 'events';
import { generate } from 'shortid';
import MFS from 'memory-fs';
const fs = new MFS();

export { fs };

export const loader = webpackConfig => {
  const emitter = new EventEmitter();
  const tempFileName = `${generate()}.js`;
  let hasBuilt = false;

  const compiler = webpack({
    mode: process.env.NODE_ENV || 'development',
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: '/node_modules/'
        }
      ]
    },
    output: {
      filename: tempFileName,
      path: '/'
    },
    ...webpackConfig
  });
  compiler.outputFileSystem = fs;

  compiler.watch({
    aggregateTimeout: 1000,
    ignored: /node_modules/
  }, (err, status) => {
    if (err) throw new Error(err);

    if (status.hasErrors()) {
      const info = status.toJson();
      if (status.hasErrors()) info.errors.forEach(e => log('error', e));
      if (status.hasWarnings()) info.warnings.forEach(e => log('warn', e));
    }
    
    if (hasBuilt) {
      emitter.emit('change', fs.readFileSync(`/${tempFileName}`));
    } else {
      hasBuilt = true;
      emitter.emit('ready', fs.readFileSync(`/${tempFileName}`));
    }
  });

  return emitter;
}
