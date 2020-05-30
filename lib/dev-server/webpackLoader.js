import webpack from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

import { serverLog as log } from '../utils/logger';
import projectScanner from './projectScanner';
import EventEmitter from 'events';
import { resolve } from 'path';
import { generate } from 'shortid';
import { fs } from 'memfs';
import { ufs } from 'unionfs';

export default async (webpackConfig, updateListener, projectParseOption) => {
  const compile = (configs, replaceContent) => {
    const emitter = new EventEmitter();
    const tempFileName = `${generate()}.js`;

    const compiler = webpack({
      mode: process.env.NODE_ENV || 'development',
      module: {
        rules: [
          {
            test: /\.js$/,
            use: {
              loader: resolve(__dirname, './webpackInserter.js'),
              options: {
                content: replaceContent
              }
            },
            exclude: /node_modules/
          },
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
      ...configs
    });
    compiler.outputFileSystem = fs;

    compiler.run((err, status) => {
      if (err) throw new Error(err);

      if (status.hasErrors()) {
        const info = status.toJson();
        if (status.hasErrors()) info.errors.forEach(e => log('error', e));
        if (status.hasWarnings()) info.warnings.forEach(e => log('warn', e));
      }

      emitter.emit('ready', fs.readFileSync(`/${tempFileName}`).toString());
    });

    emitter.on('update', () => compiler.run((err, status) => {
      if (err) throw new Error(err);

      if (status.hasErrors()) {
        const info = status.toJson();
        if (status.hasErrors()) info.errors.forEach(e => log('error', e));
        if (status.hasWarnings()) info.warnings.forEach(e => log('warn', e));
      }

      emitter.emit('change', fs.readFileSync(`/${tempFileName}`).toString());
    }))

    return emitter;
  };

  const emitter = compile(webpackConfig, await projectScanner(compile, {
    ...projectParseOption,
    target: webpackConfig.target
  }));

  updateListener.on('update', () => emitter.emit('update'));

  return emitter;
}
