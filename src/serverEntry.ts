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

// TODO - Dynamic construction.
import { explorerRoute, explorerSocket } from './apps/explorer/backend';
import { monitorRoute, monitorSocket } from './apps/monitor/backend';
import { browserRoute, browserSocket } from './apps/browser/backend';
import { databaseRoute, databaseSocket } from './apps/database/backend';
import { planRoute, planSocket } from './apps/plan/backend';
import { terminalRoute, terminalSocket } from './apps/terminal/backend';
import { themeRoute, themeSocket } from './apps/theme/backend';
import { marketRoute, marketSocket } from './apps/market/backend';
import { settingRoute, settingSocket } from './apps/setting/backend';

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
