import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

import { serverLog as log } from '../utils/logger';
import EventEmitter from 'events';
import { generate } from 'shortid';
import MFS from 'memory-fs';
const fs = new MFS();

export default async (webpackConfig, updateListener) => {
  const emitter = new EventEmitter();
  const tempFileName = `${generate()}.js`;
  let hasBuilt = false;

  const compile = () => {
    const compiler = webpack({
      mode: process.env.NODE_ENV || 'development',
      module: {
        rules: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
          }
        ]
      },
      output: {
        filename: tempFileName,
        path: '/'
      },
      optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
          terserOptions: {
            output: {
              comments: false
            },
          },
          extractComments: false,
          sourceMap: process.env.NODE_ENV === 'development'
        })],
      },
      ...webpackConfig
    });
    compiler.outputFileSystem = fs;

    compiler.run((err, status) => {
      if (err) throw new Error(err);

      if (status.hasErrors()) {
        const info = status.toJson();
        if (status.hasErrors()) info.errors.forEach(e => log('error', e));
        if (status.hasWarnings()) info.warnings.forEach(e => log('warn', e));
      }

      if (hasBuilt) {
        emitter.emit('change', fs.readFileSync(`/${tempFileName}`).toString());
      } else {
        hasBuilt = true;
        emitter.emit('ready', fs.readFileSync(`/${tempFileName}`).toString());
      }
    });
  };
  compile();

  updateListener.on('update', compile);

  return emitter;
}
