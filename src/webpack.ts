import * as Koa from 'koa';

import { join } from 'path';
import * as webpack from 'webpack';
import { Volume, IFs } from 'memfs';
import { Union } from 'unionfs'
import * as realFs from 'fs';
import { Script, createContext } from 'vm';
import { generate as generateId } from 'shortid';
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
};

const fs: IFs = ((new Union()) as any).use(realFs).use(Volume.fromJSON({
  [join(__dirname, './__client.ts')]: `require('${join(
    __dirname, './clientEntry.tsx'
  ).split('\\').join('\\\\')}');`,
  [join(__dirname, './__server.ts')]: `require('${join(
    __dirname, './serverEntry.ts'
  ).split('\\').join('\\\\')}');`
}));
fs['join'] = join;

let clientDepsList: string[] = Object.keys(JSON.parse(realFs.readFileSync(
  join(__dirname, '../package.json'), 'utf8'
)).dependencies);
let clientDepsIdMap: { [key: string]: string } = {
  ...clientDepsList.reduce((obj, key) => ({
    ...obj,
    [key]: generateId().split('-').join('')
  }), {})
};
let clientDepsOrder: string[] = clientDepsList.sort((leftName, rightName) => {
  const deps = (obj => [
    ...(obj.dependencies ? Object.keys(obj.dependencies) : []),
    ...(obj.devDependencies ? Object.keys(obj.devDependencies) : []),
    ...(obj.peerDependencies ? Object.keys(obj.peerDependencies) : [])
  ])(JSON.parse(realFs.readFileSync(join(
    __dirname, '../node_modules', `./${leftName}/package.json`
  ), 'utf8')));
  if (deps.indexOf(rightName) >= 0) {
    return 1;
  } else {
    return -1;
  }
});

let appsIdMap: { [key: string]: string } = {};
for (const pkgName of realFs.readdirSync(join(__dirname, 'apps'))) {
  let externalFilename = '';
  for (const ex of ['.js', '.jsx', '.mjs', '.ts', '.tsx']) {
    if (realFs.existsSync(join(__dirname, 'apps', pkgName, 'frontend' + ex))) {
      externalFilename = `frontend${ex}`;
      break;
    }
  }
  if (externalFilename !== '') {
    appsIdMap[`pneumatic.${pkgName}`] = generateId();
    const body = `
      const component = require("${join(__dirname, 'apps', pkgName, externalFilename)
        .split('\\').join('\\\\')}").pages[/page=(.+)\\&?/.exec(location.search)[1]];
      console.log(component);
      require('react-dom').render(require('react').createElement(component), document.querySelector('#root'));
    `;
    fs.writeFileSync(join(__dirname, `${appsIdMap[`pneumatic.${pkgName}`]}.ts`), body);
  }
}

export async function clientSideMiddleware(
  ctx: Koa.Context,
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
          ${clientDepsOrder.map(key => `
            <script src='/${clientDepsIdMap[key]}'></script>
          `).join('\n')}
          <script src='/entry'></script>
        </body>
      </html>`;
      ctx.type = 'text/html';
      break;
    case '/entry':
      ctx.body = fs.readFileSync(join(__dirname, '__client.bundle.js'), 'utf8');
      ctx.type = 'text/javascript';
      break;
    default:
      for (const key of Object.keys(appsIdMap)) {
        if (ctx.path === `/${appsIdMap[key]}`) {
          ctx.body = `<html>
            <head>
              <title>Pneumatic</title>
              <meta name='viewport' content='width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no'>
            </head>
            <body>
              <div id='root'></div>
              ${clientDepsOrder.map(key => `
                <script src='/${clientDepsIdMap[key]}'></script>
              `).join('\n')}
              <script>
                ${fs.readFileSync(join(__dirname, `/${appsIdMap[key]}.bundle.js`), 'utf8')}
              </script>
            </body>
          </html>
          `;
          ctx.type = 'text/html';
          break;
        }
      }
      for (const key of clientDepsList) {
        if (ctx.path === `/${clientDepsIdMap[key]}`) {
          ctx.body = fs.readFileSync(
            join(__dirname, `/${clientDepsIdMap[key]}.bundle.js`), 'utf8'
          );
          ctx.type = 'text/javascript';
          break;
        }
      }
      await next();
  }
}

export let serverRoutes = async (
  _ctx: Koa.Context,
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
      _ctx: Koa.Context,
      _next: () => Promise<void>
    ) => {
      log('warn', 'Please wait, the service is not ready now.');
    };

    let serverEntryMap: {
      [pkg: string]: {
        client?: string,
        server?: string,
        info?: string
      }
    } = {};

    for (const pkgName of realFs.readdirSync(join(__dirname, 'apps'))) {
      // TODO - Use regular expression to make the code more pretter.
      serverEntryMap[`pneumatic.${pkgName}`] = {};
      let clientFileName = '';
      let serverFileName = '';
      let infoFileName = '';
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
      for (const ex of ['.js', '.jsx', '.mjs', '.ts', '.tsx']) {
        if (realFs.existsSync(join(__dirname, 'apps', pkgName, 'info' + ex))) {
          infoFileName = `info${ex}`;
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
      if (infoFileName !== '') {
        serverEntryMap[`pneumatic.${pkgName}`].info =
          join(__dirname, 'apps', pkgName, infoFileName).split('\\').join('\\\\');
      }
    }

    fs.writeFileSync(join(__dirname, '__server_id.ts'), `
      export const entryMap = {${Object.keys(serverEntryMap).map(pkg => `"${pkg}": {
        ${serverEntryMap[pkg].client ? `...require("${serverEntryMap[pkg].client}")` : ''},
        ${serverEntryMap[pkg].server ? `...require("${serverEntryMap[pkg].server}")` : ''},
        ${serverEntryMap[pkg].info ? `...require("${serverEntryMap[pkg].info}")` : ''},
        id: '${appsIdMap[pkg]}'
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
          ...clientDepsList.reduce((
            obj: { [key: string]: string[] }, key: string
          ) => ({
            ...obj,
            [key]: `__lib_${clientDepsIdMap[key]}`
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
          ...clientDepsList.reduce((
            obj: { [key: string]: string[] }, key: string
          ) => ({
            ...obj,
            [key]: `__lib_${clientDepsIdMap[key]}`
          }), {})
        },
        cache: {
          type: 'memory'
        },
        devtool: process.env.NODE_ENV === 'production' ? 'none' : 'inline-source-map'
      } as webpack.Configuration)),
      ...clientDepsList.map(key => ({
        ...globalConfig,
        entry: [key],
        mode: process.env.NODE_ENV === 'development' ? 'development' : 'production',
        target: 'web',
        externals: {
          ...clientDepsList.filter(n => n !== key).reduce((
            obj: { [key: string]: string[] }, key: string
          ) => ({
            ...obj,
            [key]: `__lib_${clientDepsIdMap[key]}`
          }), {})
        },
        output: {
          filename: `${clientDepsIdMap[key]}.bundle.js`,
          path: __dirname,
          library: `__lib_${clientDepsIdMap[key]}`,
          libraryTarget: 'var'
        },
        devtool: process.env.NODE_ENV === 'production' ? 'none' : 'inline-source-map'
      } as webpack.Configuration))
    ]);
    compiler.inputFileSystem = fs;
    compiler.outputFileSystem = fs;

    setTimeout(() => compiler.run((err: Error, stats) => {
      if (err) {
        console.error(err);
      } else if (stats.hasErrors()) {
        const info = stats.toJson();
        let errStr = '';
        if (stats.hasErrors()) {
          for (const e of info.errors) {
            errStr += `${e.message}\n`;
          }
        }
        if (stats.hasWarnings()) {
          for (const e of info.warnings) {
            errStr += `${e.message}\n`;
          }
        }
        console.error(Error(errStr));
      } else {
        log('info', 'Compiled the codes.');

        // Server reboot.
        const script = new Script(
          fs.readFileSync(join(__dirname, './__server.bundle.js'), 'utf8') as string, {
          filename: 'serverEntry.js'
        });
        const context = createContext({
          exportMiddleware(
            middlewares: ((ctx: Koa.Context, next: () => Promise<void>) => Promise<void>)[]
          ) {
            serverRoutes = async (
              ctx: Koa.Context, next: () => Promise<void>
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
