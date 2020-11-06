/// <reference types="node" />

import { join } from 'path';
import * as chalk from 'chalk';
import * as Koa from 'koa';
import * as bodyParserMiddleware from 'koa-bodyparser';
import { watch as watchFiles } from 'chokidar';
import { parser as frontendParser } from './frontendParser';
import { parser as backendParser } from './backendParser';

function parseFrontend({ component, preload }, routePath: string) {

}

function parseBackend({ matcher, level, service, protocol }, routePath: string) {

}

function routeStaticFile(path, routePath) { }

// Watch the frontend part.
watchFiles(
  join(process.cwd(), './public/frontend'), {
  ignored: /(node_modules)|(\.git)/
}).on('all', async (type, filePath) => {
  if (['add', 'change', 'unlink'].indexOf(type) < 0) {
    return;
  }

  const route = /^\.?(.+)(\.[a-z]+)$/.exec(filePath
    .substr(join(process.cwd(), './public/frontend').length)
    .split(/[\\\/]/)
    .join('.'))[1];

  console.log(type, route, filePath);
});

// Watch the backend part.
watchFiles(
  join(process.cwd(), './public/backend'), {
  ignored: /(node_modules)|(\.git)/
}).on('all', async (type, filePath) => {
  if (['add', 'change', 'unlink'].indexOf(type) < 0) {
    return;
  }

  const route = /^\.?(.+)(\.[a-z]+)$/.exec(filePath
    .substr(join(process.cwd(), './public/backend').length)
    .split(/[\\\/]/)
    .join('.'))[1];

  console.log(type, route, filePath);
});

const app = new Koa();

app.use(bodyParserMiddleware());

app.use(async (ctx: Koa.BaseContext, next: () => Promise<any>) => {

  await next();
});

app.listen(+process.env.PORT || 80, process.env.HOST || undefined);
