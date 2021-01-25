import { join } from 'path';
import * as Koa from 'koa';
import * as bodyParserMiddleware from 'koa-bodyparser';
import { webpackCompiler } from './webpackLoader';

const app = new Koa();

app.use(bodyParserMiddleware());

(async () => {
  console.log('Compiling the SPA part.');
  const { code } = await webpackCompiler(`
    import { render } from 'react-dom';
    render(
      document.querySelector('#root'),
      require('${join(__dirname, './entry/index.tsx')}')
    );
  `);

  app.use(async (
    ctx: Koa.BaseContext,
    next: () => Promise<unknown>
  ) => {
    console.log('New connection -', ctx.path);
    switch (ctx.path) {
      case '/':
        ctx.body = `<html>
          <head>
            <title>Test</title>
            <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">
          </head>
          <body>
            <div id="root"></div>
            <script src="spa.js"></script>
            <script src="//cdn.jsdelivr.net/npm/eruda"></script>
            <script>eruda.init();</script>
          </body>
        </html>`;
        break;
      case '/spa.js':
        ctx.body = code;
        break;
    }
  });

  app.listen(
    process.env.PORT && +process.env.PORT || 80,
    process.env.HOST || undefined
  );

  console.log('The pneumatic server is ready.');
})();
