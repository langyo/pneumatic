import { join } from 'path';
import * as Koa from 'koa';
import * as bodyParserMiddleware from 'koa-bodyparser';
import { webpackCompiler } from './webpackLoader';

const app = new Koa();

app.use(bodyParserMiddleware());

(async () => {
  console.log('Compiling');
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
    ctx.req.body = code;
    console.log('New connection.');
    await next();
  });

  app.listen(
    process.env.PORT && +process.env.PORT || 80,
    process.env.HOST || undefined
  );

  console.log('The pneumatic server is ready.');
})();
