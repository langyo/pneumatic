import chalk from 'chalk';
import { createReadStream } from 'fs';
import { resolve } from 'path';

import Koa from 'koa';
import routerMiddleware from 'koa-router';
import bodyParserMiddleware from 'koa-bodyparser';

import webpackService from './webpack';
import serviceLoader from './serviceLoader';

const app = new Koa();

app.use(bodyParserMiddleware());

(async () => {
  // The middleware to print the request info to the console.
  app.use(async (ctx, next) => {
    const now = (new Date()).toLocaleTimeString();

    console.log(`${chalk.yellow(now)} ${chalk.green(ctx.request.method)} ${chalk.whiteBright(ctx.request.ip)}: Hit ${chalk.blue(ctx.request.url)}`);
    await next();
  });

  // The middelware to route the request to the current page render.
  const router = routerMiddleware();

  router.get('/', await serviceLoader);

  router.get('/spa.js', (ctx, next) => {
    ctx.response.body = createReadStream(resolve('./dist/renderSPA.js'));
  })

  app.use(router.routes());

  let port = process.env.PORT || 3000;

  app.listen(port);

  const now = (new Date()).toLocaleTimeString();
  console.log(`${chalk.yellow(now)} ${chalk.blue('INFO')} Server has been running at the port ${port}.`);
})();

