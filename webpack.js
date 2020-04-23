import webpack from 'webpack';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';

import chalk from 'chalk';
import { resolve } from 'path';

import { accessSync, statSync, mkdirSync } from 'fs';

// Check the temporary folder, and create the folder if it's not exist.
mkdirSync(resolve('./dist/'), { recursive: true });

webpack({
  entry: './renderSPA.js',

  output: {
    path: resolve('./dist/'),
    filename: 'renderSPA.js'
  },

  mode: 'development',
  target: 'web',
  watch: true,
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/'
      }
    ]
  }
}, (err, status) => {
  if (err) throw new Error(err);

  const now = (new Date()).toLocaleTimeString();

  if (status.hasErrors()) {
    const info = status.toJson();
    if (status.hasErrors()) info.errors.forEach(e => console.log(`${chalk.yellow(now)} ${chalk.red('ERROR')}`, e));
    if (status.hasWarnings()) info.warnings.forEach(e => console.log(`${chalk.yellow(now)} ${chalk.yellow('WARN')}`, e));
  }
  else console.log(`${chalk.yellow(now)} ${chalk.blue('INFO')} Webpack has been compiled the static file. (renderSPA)`);
});

webpack({
  entry: './services.js',

  output: {
    path: resolve('./dist/'),
    filename: 'services.js'
  },

  mode: 'development',
  target: 'node',
  watch: true,
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/'
      }
    ]
  }
}, (err, status) => {
  if (err) throw new Error(err);

  const now = (new Date()).toLocaleTimeString();

  if (status.hasErrors()) {
    const info = status.toJson();
    if (status.hasErrors()) info.errors.forEach(e => console.log(`${chalk.yellow(now)} ${chalk.red('ERROR')}`, e));
    if (status.hasWarnings()) info.warnings.forEach(e => console.log(`${chalk.yellow(now)} ${chalk.yellow('WARN')}`, e));
  }
  else console.log(`${chalk.yellow(now)} ${chalk.blue('INFO')} Webpack has been compiled the static file. (services)`);
});
