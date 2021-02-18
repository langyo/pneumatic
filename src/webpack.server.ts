import { createServer } from 'http';
import * as Koa from 'koa';
import * as ws from 'ws';
import * as bodyParserMiddleware from 'koa-bodyparser';

import { join } from 'path';
import * as webpack from 'webpack';
import { Volume, IFs } from 'memfs';
import { Script, createContext } from 'vm';

import { log } from './utils/backend/logger';
import { loadBackendApp } from './webpack.client';

const fs: IFs = Volume.fromJSON({}) as IFs;
fs['join'] = join;

const compiler = webpack({
  entry: join(__dirname, './serverEntry.ts'),
  mode: 'development',
  target: 'node',
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
  devtool: 'eval-source-map'
});
compiler.outputFileSystem = fs;

let httpMiddleware = async (
  _ctx: Koa.BaseContext,
  _next: () => Promise<void>
) => {
  log('warn', 'Please wait, the service is not ready now.');
};

const app = new Koa();
app.use(bodyParserMiddleware());
app.use(async (
  ctx: Koa.BaseContext,
  next: () => Promise<void>
) => {
  log('info', `Http(${ctx.ip}):`, ctx.path);
  await loadBackendApp(ctx, async () => {
    await httpMiddleware(ctx, next);
  });
});

const server = createServer(app.callback()).listen(
  process.env.PORT && +process.env.PORT || 80,
  process.env.HOST || undefined
);

const wss = new ws.Server({ server });
wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  log('info', 'New Ws connection:', ip);
  ws.on('message', msg => {
    log('info', `Ws(${ip}):`, msg);
    ws.send(msg);
  });
});

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
    log('info', 'Compiled the service part.');

    const script = new Script(
      fs.readFileSync(join(process.cwd(), '/main.js'), 'utf8') as string, {
      filename: 'serverEntry.js'
    });
    const context = createContext({
      exportMiddleware(
        newMiddleware: (ctx: Koa.BaseContext, next: () => Promise<void>) => Promise<void>
      ) {
        httpMiddleware = newMiddleware;
      },
      console, process, require, setInterval, setTimeout
    });
    try {
      script.runInContext(context);
    } catch (e) {
      console.error(e);
    }
  }
});
