/// <reference types="node" />

import { join } from 'path';
import * as Koa from 'koa';
import * as bodyParserMiddleware from 'koa-bodyparser';
import { watch as watchFiles } from 'chokidar';
import * as reporter from './utils/reporter';
import { installComponent  } from 'nickelcat-dev-server/frontendLoader';
import { installRoute } from 'nickelcat-dev-server/backendLoader';

// Watch the frontend part.
watchFiles(
  join(process.cwd(), './public/frontend'), {
  ignored: /(node_modules)|(\.git)/
}).on('all', async (type, filePath) => {
  if (['add', 'change', 'unlink'].indexOf(type) < 0) { return; }
  const ref = require(filePath);

  const routePath = /^\.?(.+)(\.[a-z]+)$/.exec(filePath
      .substr(join(process.cwd(), './public/backend').length)
      .split(/[\\\/]/)
      .join('.'))[1];

  // Main parse logic.
  reporter.parseEnterReport('frontend', routePath);

  try {
    await installComponent(
      ref.component,
      Object.keys(ref)
        .filter(n => n !== 'component')
        .reduce((obj, key) => ({
          ...obj, [key]: ref[key]
        }), {}),
      filePath,
      { routePath }
    );
  } catch ({ message }) {
    reporter.parseCrashReport('frontend', routePath, message);
  }

});

// Watch the backend part.
watchFiles(
  join(process.cwd(), './public/backend'), {
  ignored: /(node_modules)|(\.git)/
}).on('all', async (type, filePath) => {
  if (['add', 'change', 'unlink'].indexOf(type) < 0) { return; }
  const ref = require(filePath);

  const routePath = /^\.?(.+)(\.[a-z]+)$/.exec(filePath
      .substr(join(process.cwd(), './public/backend').length)
      .split(/[\\\/]/)
      .join('.'))[1];

  // Main parse logic.
  reporter.parseEnterReport('backend', routePath);

  try {
    await installRoute(
      ref.router,
      Object.keys(ref)
        .filter(n => n !== 'router')
        .reduce((obj, key) => ({
          ...obj, [key]: ref[key]
        }), {}),
      filePath,
      { routePath }
    );
  } catch ({ message }) {
    reporter.parseCrashReport('backend', routePath, message);
  }

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

  reporter.parseEnterReport('static', routePath);
});

const app = new Koa();

app.use(bodyParserMiddleware());

app.use(async (ctx: Koa.BaseContext, next: () => Promise<any>) => {

  await next();
});

app.listen(+process.env.PORT || 80, process.env.HOST || undefined);
