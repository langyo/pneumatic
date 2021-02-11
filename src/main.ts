import { join } from 'path';
import * as Koa from 'koa';
import * as bodyParserMiddleware from 'koa-bodyparser';

import * as webpack from 'webpack';
import { Volume, IFs } from 'memfs';
import { Union } from 'unionfs'
import * as realFs from 'fs';

const app = new Koa();

app.use(bodyParserMiddleware());

(async () => {
  console.log('Compiling the SPA part.');
  const fs: IFs = ((new Union()) as any).use(realFs).use(Volume.fromJSON({
    [join(process.cwd(), './__entry.ts')]: `
import { render } from 'react-dom';
import { createElement } from 'react';
render(
  createElement(
    require('${join(
      __dirname, './entry/index.tsx'
    ).split('\\').join('\\\\')}').default
  ),
  document.querySelector('#root')
);`
  }));
  fs['join'] = join;

  const compiler = webpack({
    entry: join(process.cwd(), './__entry.ts'),
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
      filename: 'output.js',
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

  console.log('Creating the server.');
  app.use(async (
    ctx: Koa.BaseContext,
    _next: () => Promise<unknown>
  ) => {
    console.log('New connection -', ctx.path);
    switch (ctx.path) {
      case '/output.js':
        ctx.body = fs.readFileSync(join(process.cwd(), '/output.js'), 'utf8');
        break;
      case '/output.js.map':
        ctx.body = fs.readFileSync(join(process.cwd(), '/output.js.map'), 'utf8');
        break;
      case '/':
        ctx.body = `<html>
          <head>
            <title>Test</title>
            <meta name='viewport' content='width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no'>
          </head>
          <body>
            <div id='root'></div>
            ${ctx.query.debug === '1' && `
            <script src='//cdn.jsdelivr.net/npm/eruda'></script><script>eruda.init();</script>
            ` || ``}
            <script src='/output.js'></script>
          </body>
        </html>`;
        break;
    }
  });

  app.listen(
    process.env.PORT && +process.env.PORT || 80,
    process.env.HOST || undefined
  );

  console.log('The pneumatic server is ready.');
})();
