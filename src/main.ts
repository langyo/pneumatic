/// <reference types="node" />

import { join } from 'path';
import { accessSync, mkdirSync } from 'fs';
import * as Koa from 'koa';
import * as bodyParserMiddleware from 'koa-bodyparser';
import { watch as watchFiles } from 'chokidar';
import { parseActionObject, parseAST } from 'nickelcat-dev-server/actionTraitParser';

import { blue, red, green, yellow, white } from 'chalk';
import { log, registerCallback, ILog } from 'nickelcat/logManager';
import { access } from 'fs/promises';

// Register the log printer.
registerCallback((log: ILog) => {
  console.log(
    white.bold((new Date(log.time)).toLocaleString()),
    blue(log.eventType.toUpperCase()),
    green(log.path),
    white(log.extraInfo)
  );
});

function parseFile(routePath: string, ref: { [key: string]: unknown }) {
  for (const actionName of Object.keys(ref)) {
    if (typeof ref[actionName] === 'object') {
      parseActionObject(routePath, actionName, ref[actionName];)
    }
  }
}

// Watch the web OS's part.
watchFiles(
  join(process.cwd(), './src/app/'), {
  ignored: /(node_modules)|(\.git)/
}).on('all', async (type, filePath) => {
  if (['add', 'change', 'unlink'].indexOf(type) < 0) { return; }
  const ref = require(filePath);

  const routePath = `pneumatic.app.${/^\.?(.+)(\.[a-z]+)$/.exec(filePath
    .substr(join(process.cwd(), './src/app').length)
    .split(/[\\\/]/)
    .join('.'))}`;

  // Main parse logic.
  log('info', `Parsing '${routePath}'`);
  parseFile(routePath, ref);
});

// Watch the user's services part.
try {
  accessSync(join(process.cwd(), './public/'));
} catch (_e) {
  mkdirSync(join(process.cwd(), './public/'));
}
watchFiles(
  join(process.cwd(), './public/'), {
  ignored: /(node_modules)|(\.git)/
}).on('all', async (type, filePath) => {
  if (['add', 'change', 'unlink'].indexOf(type) < 0) { return; }
  const ref = require(filePath);

  const routePath = /^\.?(.+)(\.[a-z]+)$/.exec(filePath
    .substr(join(process.cwd(), './public/').length)
    .split(/[\\\/]/)
    .join('.'))[1];

  // Main parse logic.
  log('info', `Parsing '${routePath}'`);
  parseFile(routePath, ref);
});

// Watch the static files' folder.
watchFiles(
  join(process.cwd(), './public/static'), {
  ignored: /(node_modules)|(\.git)/
}).on('all', async (type, filePath) => {
  if (['add', 'change', 'unlink'].indexOf(type) < 0) { return; }

  const routePath = /^\.?(.+)(\.[a-z]+)$/.exec(filePath
    .substr(join(process.cwd(), './public/backend').length)
    .split(/[\\\/]/)
    .join('.'))[1];

  log('info', `Registering static files: '${routePath}'`);
  // TODO - Write the middleware logic.
});

const app = new Koa();

app.use(bodyParserMiddleware());

app.use(async (ctx: Koa.BaseContext, next: () => Promise<unknown>) => {

  await next();
});

app.listen(+process.env.PORT || 80, process.env.HOST || undefined);
