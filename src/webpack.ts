import * as Koa from 'koa';

import { join } from 'path';
import * as webpack from 'webpack';
import { Volume, IFs } from 'memfs';
import { Union } from 'unionfs'
import * as realFs from 'fs';
import { Script, createContext } from 'vm';

import { v4 } from 'uuid';
import { EventEmitter } from 'events';
import { log } from './utils/backend/logger';

const globalConfig = {
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
    extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx'],
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
  }
}

let clientBundleId = {
  main: v4()
};

const clientSideFs: IFs = ((new Union()) as any).use(realFs).use(Volume.fromJSON({
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
clientSideFs['join'] = join;

const clientSideCompiler = webpack({
  ...globalConfig,
  entry: {
    main: join(process.cwd(), './main.ts')
  },
  mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
  output: {
    filename: '[name].bundle.js',
    path: process.cwd()
  },
  devtool: process.env.NODE_ENV === 'production' ? 'none' : 'inline-source-map'
});
clientSideCompiler.inputFileSystem = clientSideFs;
clientSideCompiler.outputFileSystem = clientSideFs;

clientSideCompiler.watch({
  ignored: ['**/node_modules/**', '**/.git/**']
}, (err: Error, status) => {
  if (err) {
    console.error(err);
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
    console.error(Error(errStr));
  } else {
    log('info', 'Compiled the client part.');
  }
});

export async function clientSideMiddleware(
  ctx: Koa.BaseContext,
  next: () => Promise<unknown>
) {
  const entryId = clientBundleId.main;

  switch (ctx.path) {
    case `/${entryId}`:
      ctx.body = clientSideFs.readFileSync(join(process.cwd(), '/main.bundle.js'), 'utf8');
      ctx.type = 'application/javascript';
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
          <script src='/${entryId}'></script>
        </body>
      </html>`;
      ctx.type = 'text/html';
      break;
    default:
      await next();
  }
}

const serverPartFs: IFs = Volume.fromJSON({}) as IFs;
serverPartFs['join'] = join;

const serverPartCompiler = webpack({
  ...globalConfig,
  entry: join(__dirname, './serverEntry.ts'),
  mode: 'development',
  target: 'node',
  output: {
    filename: '[name].js',
    path: process.cwd()
  },
  devtool: 'eval-source-map'
});
serverPartCompiler.outputFileSystem = serverPartFs;

export let serverSideMiddleware = async (
  _ctx: Koa.BaseContext,
  _next: () => Promise<void>
) => {
  log('warn', 'Please wait, the service is not ready now.');
};
export let serverSideLongtermMiddleware: {
  [pkg: string]: (ctx, emitter: EventEmitter) => Promise<void>
} = {};

serverPartCompiler.watch({
  ignored: ['**/node_modules/**', '**/.git/**']
}, (err: Error, status) => {
  if (err) {
    console.error(err);
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
    console.error(Error(errStr));
  } else {
    log('info', 'Compiled the service part.');

    const script = new Script(
      serverPartFs.readFileSync(join(process.cwd(), '/main.js'), 'utf8') as string, {
      filename: 'serverEntry.js'
    });
    const context = createContext({
      exportMiddleware(
        middlewares: ((ctx: Koa.BaseContext, next: () => Promise<void>) => Promise<void>)[]
      ) {
        serverSideMiddleware = async (
          ctx: Koa.BaseContext, next: () => Promise<void>
        ) => {
          async function nextTask(pos: number) {
            await middlewares[pos](ctx, async () => {
              if (pos + 1 === middlewares.length) {
                await next();
              } else {
                await nextTask(pos + 1);
              }
            });
          }
          await nextTask(0);
        };
      },
      exportLongtermMiddleware(
        middlewareMap: { [pkg: string]: (ctx, emitter: EventEmitter) => Promise<void> }
      ) {
        serverSideLongtermMiddleware = middlewareMap;
      },
      console, process, require, setInterval, setTimeout, clearInterval, clearTimeout
    });
    try {
      script.runInContext(context);
    } catch (e) {
      console.error(e);
    }
  }
});
