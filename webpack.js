import webpack from 'webpack';
import chalk from 'chalk';
import { resolve } from 'path';

webpack({
  entry: './renderSPA.js',

  output: {
    path: resolve('./'),
    filename: 'bundle.js'
  },

  mode: 'development',
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
  else console.log(`${chalk.yellow(now)} ${chalk.blue('INFO')} Webpack has been compiled the static file.`);
});

