import { join } from 'path';
import * as Koa from 'koa';
import * as bodyParserMiddleware from 'koa-bodyparser';
import { webpackCompiler } from 'nickelcat-dev-server/webpackLoader';

const app = new Koa();

app.use(bodyParserMiddleware());

app.use(async (
	ctx: Koa.BaseContext,
	next: () => Promise<unknown>
) => {
  const { code } = await webpackCompiler(`
  	import { render } from 'react-dom';
  	render(
  		document.querySelector('#root');
  		require(${join(__dirname, './entry/index')})
  	)
  `);
  ctx.req.body = `
  	<head>
  		<title>Test</title>
  	</head>
  	<body>
  		<div id="root"></div>
  		<script>${code}</script>
  	</body>
  `;
  await next();
});

app.listen(
	process.env.PORT && +process.env.PORT || 80,
	process.env.HOST || undefined
);
