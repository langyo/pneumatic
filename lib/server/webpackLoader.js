import webpack from 'webpack';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';

import chalk from 'chalk';
import { resolve } from 'path';
import EventEmitter from 'events';

import { mkdirSync } from 'fs';

export default ({ webpackConfig, defaultDirPath }) => {
  // Check the temporary folder, and create the folder if it's not exist.
  mkdirSync(resolve(defaultDirPath), { recursive: true });

  const emitter = new EventEmitter();
  let hasBuilt = false;

  webpack({
    mode: process.env.NODE_ENV || 'development',
    watch: true,
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: '/node_modules/'
        }
      ]
    },
    ...webpackConfig
  }, (err, status) => {
    if (err) throw new Error(err);

    const now = (new Date()).toLocaleTimeString();

    if (status.hasErrors()) {
      const info = status.toJson();
      if (status.hasErrors()) info.errors.forEach(e => console.log(`${chalk.yellow(now)} ${chalk.red('ERROR')}`, e));
      if (status.hasWarnings()) info.warnings.forEach(e => console.log(`${chalk.yellow(now)} ${chalk.yellow('WARN')}`, e));
    }
    else console.log(`${chalk.yellow(now)} ${chalk.blue('INFO')} Webpack has been compiled the static file. (renderSPA)`);
    
    if (hasBuilt) {
      emitter.emit('change');
    } else {
      hasBuilt = true;
      emitter.emit('ready');
    }
  });

  return emitter;
}
