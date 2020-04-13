import chalk from 'chalk';
import { createReadStream } from 'fs';

import Koa from 'koa';
import routerMiddleware from 'koa-router';
import bodyParserMiddleware from 'koa-bodyparser';

import webpackService from './webpack';
// import SSRRender from './renderSSR';

const app = new Koa();

app.use(bodyParserMiddleware());

// The middleware to print the request info to the console.
app.use(async (ctx, next) => {
  const now = (new Date()).toLocaleTimeString();

  console.log(`${chalk.yellow(now)} ${chalk.green(ctx.request.method)} ${chalk.whiteBright(ctx.request.ip)}: Hit ${chalk.blue(ctx.request.url)}`);
  await next();
});

// The middelware to route the request to the current page render.
const router = routerMiddleware();

router.get('/', async (ctx, next) => {
  ctx.response.type = 'text/html';
  ctx.response.body = `
<html>
<head>
  <title>Demo Page</title>
  <style>
    body {
      padding: 0px;
      margin: 0px;
    }
  </style>
  <meta name="viewport" id="viewport" content="width=device-width, initial-scale=1" />
  <style>${
    ''
  }</style>
<head>
<body>
  <div id="root">${
    ''
  }</div>
  <script>${
    ''    
  }</script>
  <script src="/spa.js"></script>
  <script>
;(function () {
  var src = '//cdn.jsdelivr.net/npm/eruda';
  if (!/mobile_dev=true/.test(window.location)) return;
  document.write('<scr' + 'ipt src="' + src + '"></scr' + 'ipt>');
  document.write('<scr' + 'ipt>eruda.init();</scr' + 'ipt>');
})();
  </script>
</body>
</html>`;
});

router.get('/spa.js', (ctx, next) => {
  ctx.response.body = createReadStream('bundle.js');
})

app.use(router.routes());

(async () => {
  let port = process.env.PORT || 3000;

  app.listen(port);
  
  const now = (new Date()).toLocaleTimeString();
  console.log(`${chalk.yellow(now)} ${chalk.blue('INFO')} Server has been running at the port ${port}.`);
})();

