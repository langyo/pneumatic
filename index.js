import Koa from 'koa';
import routerMiddleware from 'koa-router';
import bodyParserMiddleware from 'koa-bodyparser';
import chalk from 'chalk';

const app = new Koa();

app.use(bodyParserMiddleware());

const router = routerMiddleware();

// The middleware to print the request info to the console.
app.use(async (ctx, next) => {
  const now = (new Date()).toLocaleTimeString();

  console.log(`${chalk.yellow(now)} ${chalk.green(ctx.request.method)} ${chalk.grey(ctx.request.ip)}: Hit ${chalk.blue(ctx.request.url)}`);
  await next();
});

// The middelware to route the request to the current page render.
const router = routerMiddleware();

import loadingComponent from './components/loading';
import webpackLoader from './webpackLoader';

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
  <style>${
    loadingComponent.loadCss()
  }</style>
<head>
<body>
  <div id="root">${
    loadingComponent.loadHtml()
  }</div>
  <script>${
    webpackLoader.getBundle()    
  }</script>
</body>
</html>
  `;
});

app.use(router.routes());

import portScanner from './utils/portScanner';

(async () => {
  const port = await portScanner();

  // Create the HTTP server at the port 3000.
  // You can change the argument to use the other port.
  app.listen(port);
  console.log(chalk.green(`Server has been running at the port ${port}.`));
})()

