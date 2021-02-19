import * as Koa from 'koa';
import { log } from './utils/backend/logger';

declare global {
  function exportMiddleware(
    middlewares: ((ctx: Koa.BaseContext, next: () => Promise<void>) => Promise<void>)[]
  ): void;
  function exportLongtermMiddleware(/* TODO */): void;
};

import { explorerRoute } from './apps/explorer/routes/service';
import { monitorRoute } from './apps/monitor/routes/service';
import { browserRoute } from './apps/browser/routes/service';
import { databaseRoute } from './apps/database/routes/service';
import { planRoute } from './apps/plan/routes/service';
import { terminalRoute } from './apps/terminal/routes/service';
import { themeRoute } from './apps/theme/routes/service';
import { marketRoute } from './apps/market/routes/service';
import { settingRoute } from './apps/setting/routes/service';

exportMiddleware([
  explorerRoute,
  monitorRoute,
  browserRoute,
  databaseRoute,
  planRoute,
  terminalRoute,
  themeRoute,
  marketRoute,
  settingRoute
]);

log('info', 'Server is ready.');
