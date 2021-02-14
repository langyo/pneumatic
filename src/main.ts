import * as Koa from 'koa';
import * as bodyParserMiddleware from 'koa-bodyparser';
import { authLoginMiddleware, authVerify } from './utils/backend/authVerifyMiddleware';
import { loadBackendApp } from './serverEntry';

import { explorerRoute } from './apps/explorer/routes/service';
import { monitorRoute } from './apps/monitor/routes/service';
import { browserRoute } from './apps/browser/routes/service';
import { databaseRoute } from './apps/database/routes/service';
import { planRoute } from './apps/plan/routes/service';
import { terminalRoute } from './apps/terminal/routes/service';
import { themeRoute } from './apps/theme/routes/service';
import { marketRoute } from './apps/market/routes/service';

const app = new Koa();

app.use(bodyParserMiddleware());

app.use(async (
  ctx: Koa.BaseContext,
  next: () => Promise<unknown>
) => {
  console.log('New connection -', ctx.path);
  await next();
});

app.use(authVerify(explorerRoute));
app.use(authVerify(monitorRoute));
app.use(authVerify(browserRoute));
app.use(authVerify(databaseRoute));
app.use(authVerify(planRoute));
app.use(authVerify(terminalRoute));
app.use(authVerify(themeRoute));
app.use(authVerify(marketRoute));

app.use(loadBackendApp);

app.listen(
  process.env.PORT && +process.env.PORT || 80,
  process.env.HOST || undefined
);

console.log('Server is ready.');
