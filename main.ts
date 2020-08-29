/// <reference types="node" />

import * as chalk from 'chalk';

import * as Koa from 'koa';
import * as bodyParserMiddleware from 'koa-bodyparser';

import { serviceLoader } from 'nickelcat-dev-server/serviceLoader';

const app = new Koa();

app.use(bodyParserMiddleware());

(async () => {
  // The middleware to print the request info to the console.
  app.use(async (ctx, next) => {
    console.log(`${chalk.green(ctx.request.method)} ${chalk.whiteBright(ctx.request.ip)}: Hit ${chalk.blue(ctx.request.url)}`);
    await next();
  });

  app.use(await serviceLoader());

  let port = process.env.PORT || 3000;

  app.listen(port);

  console.log(`Server has been running at the port ${port}.`);
})();
