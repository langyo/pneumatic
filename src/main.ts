/// <reference types="node" />

import { join } from 'path';
import * as Koa from 'koa';
import * as bodyParserMiddleware from 'koa-bodyparser';
import { watch as watchFiles } from 'chokidar';
import * as reporter from './utils/reporter';

// Watch the frontend part.
watchFiles(
  join(process.cwd(), './public/frontend'), {
  ignored: /(node_modules)|(\.git)/
}).on('all', async (type, filePath) => {
  if (['add', 'change', 'unlink'].indexOf(type) < 0) { return; }
  const ref = require(filePath);

  // Check path and protocol.
  if (typeof ref.path !== 'undefined' && typeof ref.path !== 'string') {
    reporter.parseCrashReport(
      'frontend', '[unknown]', 'The path must be a string.'
    );
    return;
  }
  if (typeof ref.protocol !== 'undefined' && typeof ref.protocol !== 'string') {
    reporter.parseCrashReport(
      'frontend', '[unknown]', 'The protocol must be a string.'
    );
    return;
  }

  // Parse path and protocol.
  const path = typeof ref.path !== 'undefined' ? ref.path
    : /^\.?(.+)(\.[a-z]+)$/.exec(filePath
      .substr(join(process.cwd(), './public/frontend').length)
      .split(/[\\\/]/)
      .join('.'))[1];
  const protocol = typeof ref.protocol !== 'undefined' ? ref.protocol
    : '' /* TODO */;
  reporter.parseEnterReport('frontend', path);

});

// Watch the backend part.
watchFiles(
  join(process.cwd(), './public/backend'), {
  ignored: /(node_modules)|(\.git)/
}).on('all', async (type, filePath) => {
  if (['add', 'change', 'unlink'].indexOf(type) < 0) { return; }
  const ref = require(filePath);

  // Check path and protocol.
  if (typeof ref.path !== 'undefined' && typeof ref.path !== 'string') {
    reporter.parseCrashReport(
      'frontend', '[unknown]', 'The path must be a string.'
    );
    return;
  }
  if (typeof ref.protocol !== 'undefined' && typeof ref.protocol !== 'string') {
    reporter.parseCrashReport(
      'frontend', '[unknown]', 'The protocol must be a string.'
    );
    return;
  }

  // Parse path and protocol.
  const path = typeof ref.path !== 'undefined' ? ref.path
    : /^\.?(.+)(\.[a-z]+)$/.exec(filePath
      .substr(join(process.cwd(), './public/backend').length)
      .split(/[\\\/]/)
      .join('.'))[1];
  const protocol = typeof ref.protocol !== 'undefined' ? ref.protocol
    : '' /* TODO */;
  reporter.parseEnterReport('backend', path);

});

// Watch the static files' folder.
watchFiles(
  join(process.cwd(), './public/static'), {
  ignored: /(node_modules)|(\.git)/
}).on('all', async (type, filePath) => {
  if (['add', 'change', 'unlink'].indexOf(type) < 0) { return; }

  const path = /^\.?(.+)(\.[a-z]+)$/.exec(filePath
    .substr(join(process.cwd(), './public/backend').length)
    .split(/[\\\/]/)
    .join('.'))[1];

  reporter.parseEnterReport('static', path);
});

const app = new Koa();

app.use(bodyParserMiddleware());

app.use(async (ctx: Koa.BaseContext, next: () => Promise<any>) => {

  await next();
});

app.listen(+process.env.PORT || 80, process.env.HOST || undefined);
