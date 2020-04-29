import chalk from 'chalk';
import { createReadStream } from 'fs';
import { resolve } from 'path';

import Koa from 'koa';
import routerMiddleware from 'koa-router';
import bodyParserMiddleware from 'koa-bodyparser';

import { serverLog as log } from './lib/utils/logger';
import serviceLoader from './serviceLoader';

const app = new Koa();

app.use(bodyParserMiddleware());

(async () => {
  // The middleware to print the request info to the console.
  app.use(async (ctx, next) => {
    log('info', `${chalk.green(ctx.request.method)} ${chalk.whiteBright(ctx.request.ip)}: Hit ${chalk.blue(ctx.request.url)}`);
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

  log('info', `Server has been running at the port ${port}.`);
})();

