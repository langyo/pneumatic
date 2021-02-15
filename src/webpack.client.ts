import * as Koa from 'koa';

import { join } from 'path';
import * as webpack from 'webpack';
import { Volume, IFs } from 'memfs';
import { Union } from 'unionfs'
import * as realFs from 'fs';

const fs: IFs = ((new Union()) as any).use(realFs).use(Volume.fromJSON({
  [join(process.cwd(), './main.ts')]: `
import { render } from 'react-dom';
import { createElement } from 'react';
render(
createElement(
  require('${join(
    __dirname, './clientEntry.tsx'
  ).split('\\').join('\\\\')}').default
),
document.querySelector('#root')
);`
}));
fs['join'] = join;

const compiler = webpack({
  entry: join(process.cwd(), './main.ts'),
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  context: process.cwd(),
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
            '@babel/preset-typescript'
          ],
          plugins: [
            '@babel/plugin-transform-runtime'
          ]
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: [
      join(process.cwd(), './node_modules'),
      'node_modules'
    ]
  },
  resolveLoader: {
    modules: [
      join(process.cwd(), './node_modules'),
      'node_modules'
    ]
  },
  output: {
    filename: '[name].js',
    path: process.cwd()
  },
  devtool: process.env.NODE_ENV === 'production' ? 'none' : 'source-map'
});
compiler.inputFileSystem = fs;
compiler.outputFileSystem = fs;

compiler.watch({
  ignored: ['**/node_modules/**', '**/.git/**']
}, (err: Error, status) => {
  if (err) {
    throw err;
  } else if (status.hasErrors()) {
    const info = status.toJson();
    let errStr = '';
    if (status.hasErrors()) {
      for (const e of info.errors) {
        errStr += e.message + '\n';
      }
    }
    if (status.hasWarnings()) {
      for (const e of info.warnings) {
        errStr += e.message + '\n';
      }
    }
    throw Error(errStr);
  } else {
    console.log('Compiled the SPA part.');
  }
});

export async function loadBackendApp(
  ctx: Koa.BaseContext,
  next: () => Promise<unknown>
) {
  switch (ctx.path) {
    case '/main.js':
      ctx.body = fs.readFileSync(join(process.cwd(), '/main.js'), 'utf8');
      break;
    case '/main.js.map':
      ctx.body = fs.readFileSync(join(process.cwd(), '/main.js.map'), 'utf8');
      break;
    case '/':
      ctx.body = `<html>
        <head>
          <title>Pneumatic</title>
          <meta name='viewport' content='width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no'>
        </head>
        <body>
          <div id='root'></div>
          ${ctx.query.debug === '1' && `
          <script src='//cdn.jsdelivr.net/npm/eruda'></script><script>eruda.init();</script>
          ` || ``}
          <script src='/main.js'></script>
        </body>
      </html>`;
      break;
    default:
      await next();
  }
}
