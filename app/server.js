import chalk from 'chalk';

import Koa from 'koa';
import routerMiddleware from 'koa-router';
import bodyParserMiddleware from 'koa-bodyparser';

const app = new Koa();

app.use(bodyParserMiddleware());

// The middleware to print the request info to the console.
app.use(async (ctx, next) => {
  const now = (new Date()).toLocaleTimeString();

  console.log(`${chalk.yellow(now)} ${chalk.green(ctx.request.method)} ${chalk.grey(ctx.request.ip)}: Hit ${chalk.blue(ctx.request.url)}`);
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
  <script src="${''}" />
</body>
</html>
  `;
});

app.use(router.routes());

const port = 3000;

app.listen(port);
console.log(chalk.green(`Server has been running at the port ${port}.`));


