import * as Koa from 'koa';

import { join } from 'path';
import * as webpack from 'webpack';
import { Volume, IFs } from 'memfs';
import { Union } from 'unionfs'
import * as realFs from 'fs';
import { Script, createContext } from 'vm';
import { v4 as generateId } from 'uuid';
import { watch as watchFiles } from 'chokidar';

import { log } from './utils/backend/logger';

const globalConfig = {
  context: __dirname,
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
      join(__dirname, '../node_modules'),
      'node_modules'
    ]
  },
  resolveLoader: {
    modules: [
      join(__dirname, '../node_modules'),
      'node_modules'
    ]
  }
}

let clientDepsIdMap: { [key: string]: string } = {
  ...Object.keys(JSON.parse(realFs.readFileSync(
    join(__dirname, '../package.json'), 'utf8'
  )).dependencies).reduce((obj, key) => ({
    ...obj,
    [key]: generateId()
  }), {})
};
let appsIdMap: { [key: string]: string } = {};

const fs: IFs = ((new Union()) as any).use(realFs).use(Volume.fromJSON({
  [join(__dirname, './__client.ts')]: `require('${join(
    __dirname, './clientEntry.tsx'
  ).split('\\').join('\\\\')}');`,
  [join(__dirname, './__server.ts')]: `require('${join(
    __dirname, './serverEntry.ts'
  ).split('\\').join('\\\\')}');`
}));
fs['join'] = join;

export async function clientSideMiddleware(
  ctx: Koa.BaseContext,
  next: () => Promise<unknown>
) {

  switch (ctx.path) {
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
          <script src='//'></script>
          ${Object.keys(clientDepsIdMap).map(key => `
            <script src='/${clientDepsIdMap[key]}'></script>
          `).join('\n')}
        </body>
      </html>`;
      ctx.type = 'text/html';
      break;
    case '//':
      ctx.body = fs.readFileSync(join(__dirname, '__client.bundle.js'), 'utf8');
      ctx.type = 'text/javascript';
      break;
    default:
      for (const key of Object.keys(clientDepsIdMap)) {
        if (ctx.path === `/${clientDepsIdMap[key]}`) {
          ctx.body = fs.readFileSync(
            join(__dirname, `/${clientDepsIdMap[key]}.bundle.js`), 'utf8'
          );
          ctx.type = 'text/javascript';
          break;
        }
      }
      for (const key of Object.keys(appsIdMap)) {
        if (ctx.path === `/${appsIdMap[key]}`) {
          ctx.body = fs.readFileSync(
            join(__dirname, `/${appsIdMap[key]}.bundle.js`), 'utf8'
          );
          ctx.type = 'text/javascript';
          break;
        }
      }
      await next();
  }
}

export let serverRoutes = async (
  _ctx: Koa.BaseContext,
  _next: () => Promise<void>
) => {
  log('warn', 'Please wait, the service is not ready now.');
};
import { socketSend } from './index';
export let serverSocketListeners: {
  [head: string]: (token: string, data: any) => void
} = {
  '#restart': () => void 0
};

let watcherWaitingState = {
  firstChange: false,
  continueChange: false
};

function watcherTrigger() {
  if (!watcherWaitingState.continueChange) {
    log('info', 'Compiling the codes.');
    watcherWaitingState.firstChange = false;
    watcherWaitingState.continueChange = false;
    serverSocketListeners['#restart']('', {});

    serverRoutes = async (
      _ctx: Koa.BaseContext,
      _next: () => Promise<void>
    ) => {
      log('warn', 'Please wait, the service is not ready now.');
    };

    for (const pkgName of realFs.readdirSync(join(__dirname, 'apps'))) {
      let externalFilename = '';
      for (const ex of ['.js', '.jsx', '.mjs', '.ts', '.tsx']) {
        if (realFs.existsSync(join(__dirname, 'apps', pkgName, 'frontend' + ex))) {
          externalFilename = `frontend${ex}`;
          break;
        }
      }
      if (externalFilename !== '') {
        const id = appsIdMap[`pneumatic.${pkgName}`] = generateId();
        const path = join(
          __dirname, 'apps', pkgName, externalFilename
        ).split('\\').join('\\\\');
        const body = `
          if (window.__apps) {
            window.__apps['${id}'] = require("${path}");
          } else {
            throw Error('Cannot register the app.');
          }
        `;
        fs.writeFileSync(join(__dirname, `${appsIdMap[`pneumatic.${pkgName}`]}.ts`), body);
      }
    }

    let serverEntryMap: {
      [pkg: string]: {
        client?: string,
        server?: string
      }
    } = {};

    for (const pkgName of realFs.readdirSync(join(__dirname, 'apps'))) {
      serverEntryMap[`pneumatic.${pkgName}`] = {};
      let clientFileName = '';
      let serverFileName = '';
      for (const ex of ['.js', '.jsx', '.mjs', '.ts', '.tsx']) {
        if (realFs.existsSync(join(__dirname, 'apps', pkgName, 'frontend' + ex))) {
          clientFileName = `frontend${ex}`;
          break;
        }
      }
      for (const ex of ['.js', '.jsx', '.mjs', '.ts', '.tsx']) {
        if (realFs.existsSync(join(__dirname, 'apps', pkgName, 'backend' + ex))) {
          serverFileName = `backend${ex}`;
          break;
        }
      }
      if (clientFileName !== '') {
        serverEntryMap[`pneumatic.${pkgName}`].client =
          join(__dirname, 'apps', pkgName, clientFileName).split('\\').join('\\\\');
      }
      if (serverFileName !== '') {
        serverEntryMap[`pneumatic.${pkgName}`].server =
          join(__dirname, 'apps', pkgName, serverFileName).split('\\').join('\\\\');
      }
    }

    fs.writeFileSync(join(__dirname, '__client_id.ts'), `
      window.__appIdMap = ${JSON.stringify(appsIdMap)};
      window.__apps = {};
    `);
    fs.writeFileSync(join(__dirname, '__server_id.ts'), `
      export const entryMap = {${Object.keys(serverEntryMap).map(pkg => `"${pkg}": {
        ${serverEntryMap[pkg].client ? `...require("${serverEntryMap[pkg].client}")` : ''},
        ${serverEntryMap[pkg].server ? `...require("${serverEntryMap[pkg].server}")` : ''}
      }`).join(',')}};
    `);

    const compiler = webpack([
      {
        ...globalConfig,
        entry: join(__dirname, './__client.ts'),
        mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
        target: 'web',
        output: {
          filename: '__client.bundle.js',
          path: __dirname
        },
        externals: {
          ...Object.keys(clientDepsIdMap).reduce((
            obj: { [key: string]: string[] }, key: string
          ) => ({
            ...obj,
            [key]: ['window', `__lib_${key}`]
          }), {})
        },
        cache: {
          type: 'memory'
        },
        devtool: process.env.NODE_ENV === 'production' ? 'none' : 'inline-source-map'
      },
      {
        ...globalConfig,
        entry: join(__dirname, './__server.ts'),
        mode: 'development',
        target: 'node',
        output: {
          filename: '__server.bundle.js',
          path: __dirname
        },
        cache: {
          type: 'memory'
        },
        devtool: 'inline-source-map'
      },
      ...Object.keys(appsIdMap).map(key => ({
        ...globalConfig,
        entry: join(__dirname, `./${appsIdMap[key]}.ts`),
        mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
        target: 'web',
        output: {
          filename: `${appsIdMap[key]}.bundle.js`,
          path: __dirname
        },
        externals: {
          ...Object.keys(clientDepsIdMap).reduce((
            obj: { [key: string]: string[] }, key: string
          ) => ({
            ...obj,
            [key]: ['window', `__lib_${key}`]
          }), {})
        },
        cache: {
          type: 'memory'
        },
        devtool: process.env.NODE_ENV === 'production' ? 'none' : 'inline-source-map'
      } as webpack.Configuration)),
      ...Object.keys(clientDepsIdMap).map(key => ({
        ...globalConfig,
        entry: [key],
        mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
        target: 'web',
        externals: {
          ...Object.keys(clientDepsIdMap).filter(n => n !== key).reduce((
            obj: { [key: string]: string[] }, key: string
          ) => ({
            ...obj,
            [key]: ['window', `__lib_${key}`]
          }), {})
        },
        output: {
          filename: `${clientDepsIdMap[key]}.bundle.js`,
          path: __dirname,
          library: `__lib_${key}`,
          libraryTarget: 'window'
        },
        devtool: process.env.NODE_ENV === 'production' ? 'none' : 'inline-source-map'
      } as webpack.Configuration))
    ]);
    compiler.inputFileSystem = fs;
    compiler.outputFileSystem = fs;

    setTimeout(() => compiler.run((err: Error, status) => {
      if (err) {
        console.error(err);
      } else if (status.hasErrors()) {
        const info = status.toJson();
        let errStr = '';
        if (status.hasErrors()) {
          for (const e of info.errors) {
            errStr += `${e.message}\n`;
          }
        }
        if (status.hasWarnings()) {
          for (const e of info.warnings) {
            errStr += `${e.message}\n`;
          }
        }
        console.error(Error(errStr));
      } else {
        log('info', 'Compiled the codes.');

        const script = new Script(
          fs.readFileSync(join(__dirname, '/__server.bundle.js'), 'utf8') as string, {
          filename: 'serverEntry.js'
        });
        const context = createContext({
          exportMiddleware(
            middlewares: ((ctx: Koa.BaseContext, next: () => Promise<void>) => Promise<void>)[]
          ) {
            serverRoutes = async (
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
              if (middlewares.length > 0) {
                await nextTask(0);
              } else {
                await next();
              }
            };
          },
          socketReceive(
            head: string,
            callback: (token: string, data: any) => void
          ) {
            serverSocketListeners[head] = callback;
          },
          socketSend,
          console, process, require,
          setInterval, setTimeout, clearInterval, clearTimeout
        });
        try {
          script.runInContext(context);
        } catch (e) {
          console.error(e);
        }
      }
    }), 0);
  } else {
    watcherWaitingState.continueChange = false;
    setTimeout(watcherTrigger, 3000);
  }
}

watchFiles(__dirname, {
  ignored: /^(node_modules)|(\.git)$/
}).on('all', () => {
  if (!watcherWaitingState.firstChange) {
    watcherWaitingState.firstChange = true;
    setTimeout(watcherTrigger, 3000);
  } else {
    watcherWaitingState.continueChange = true;
  }
});
