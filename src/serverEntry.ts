import * as Koa from 'koa';
import { authLoginMiddleware, authVerify } from './utils/backend/authVerifyMiddleware';

declare global {
  function exportMiddleware(
    newMiddleware: (ctx: Koa.BaseContext, next: () => Promise<void>) => Promise<void>
  );
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

exportMiddleware(async (ctx, next) => {
  const arr = [
    authLoginMiddleware,
    authVerify('pneumatic.explorer', explorerRoute),
    authVerify('pneumatic.monitor', monitorRoute),
    authVerify('pneumatic.browser', browserRoute),
    authVerify('pneumatic.database', databaseRoute),
    authVerify('pneumatic.plan', planRoute),
    authVerify('pneumatic.teriminal', terminalRoute),
    authVerify('pneumatic.theme', themeRoute),
    authVerify('pneumatic.market', marketRoute),
    authVerify('pneumatic.setting', settingRoute)
  ];

  async function nextTask(pos: number) {
    await arr[pos](ctx, async () => {
      if (pos + 1 === arr.length) {
        await next();
      } else {
        await nextTask(pos + 1);
      }
    });
  }
  await nextTask(0);
});

console.log('Server is ready.');
