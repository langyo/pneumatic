import * as Koa from 'koa';
import * as bodyParserMiddleware from 'koa-bodyparser';

import { join } from 'path';
import * as webpack from 'webpack';
import { Volume, IFs } from 'memfs';
import { Script, createContext } from 'vm';

import { loadBackendApp } from './webpack.client';

const fs: IFs = Volume.fromJSON({}) as IFs;
fs['join'] = join;

const compiler = webpack({
  entry: join(__dirname, './serverEntry.ts'),
  mode: 'development',
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

let middleware = async (
  _ctx: Koa.BaseContext,
  _next: () => Promise<void>
) => {
  console.log('Please wait, the server is not ready.');
};

const app = new Koa();
app.use(bodyParserMiddleware());
app.use(async (
  ctx: Koa.BaseContext,
  next: () => Promise<void>
) => {
  console.log('New connection -', ctx.path);
  await loadBackendApp(ctx, async () => {
    await middleware(ctx, next);
  })
});
app.listen(
  process.env.PORT && +process.env.PORT || 80,
  process.env.HOST || undefined
);

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
    console.log('Compiled the service part.');

    const script = new Script(
      fs.readFileSync(join(process.cwd(), '/main.js'), 'utf8') as string, {
      filename: 'serverEntry.js'
    });
    const context = createContext({
      exportMiddleware(
        newMiddleware: (ctx: Koa.BaseContext, next: () => Promise<void>) => Promise<void>
      ) {
        middleware = newMiddleware;
      },
      console, process, require
    });
    try {
      script.runInContext(context);
    } catch (e) {
      console.error(e);
    }
  }
});
