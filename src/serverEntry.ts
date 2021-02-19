import * as Koa from 'koa';
import { EventEmitter } from 'events';
import { log } from './utils/backend/logger';

declare global {
  function exportMiddleware(
    middlewares: ((ctx: Koa.BaseContext, next: () => Promise<void>) => Promise<void>)[]
  ): void;
  function exportLongtermMiddleware(
    middlewareMap: { [pkg: string]: (ctx, emitter: EventEmitter) => Promise<void> }
  ): void;
};

import { explorerRoute, explorerSocket } from './apps/explorer/routes/service';
import { monitorRoute, monitorSocket } from './apps/monitor/routes/service';
import { browserRoute, browserSocket } from './apps/browser/routes/service';
import { databaseRoute, databaseSocket } from './apps/database/routes/service';
import { planRoute, planSocket } from './apps/plan/routes/service';
import { terminalRoute, terminalSocket } from './apps/terminal/routes/service';
import { themeRoute, themeSocket } from './apps/theme/routes/service';
import { marketRoute, marketSocket } from './apps/market/routes/service';
import { settingRoute, settingSocket } from './apps/setting/routes/service';

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

exportLongtermMiddleware({
  'pneumatic.explorer': explorerSocket,
  'pneumatic.monitor': monitorSocket,
  'pneumatic.browser': browserSocket,
  'pneumatic.database': databaseSocket,
  'pneumatic.plan': planSocket,
  'pneumatic.terminal': terminalSocket,
  'pneumatic.theme': themeSocket,
  'pneumatic.market': marketSocket,
  'pneumatic.setting': settingSocket
});

log('info', 'Server is ready.');
