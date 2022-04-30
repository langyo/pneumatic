import {
  createRouter,
  Router,
  RouterHistory
} from 'vue-router';
import { useStoreForLayout } from '@/utils/store';

import OverviewVue from '@/views/overview.vue';
import DashboardSettingsVue from '@/views/dashboardSettings.vue';
import SiteMapVue from '@/views/router/siteMap.vue';
import StaticFileManagerVue from '@/views/router/staticFileManager.vue';
import RouteRuleVue from '@/views/router/routeRule.vue';
import AuditRuleVue from '@/views/router/auditRule.vue';
import ModuleManagerVue from '@/views/service/moduleManager.vue';
import DataSourceManagerVue from '@/views/service/dataSourceManager.vue';
import AggregateManagerVue from '@/views/service/aggregateManager.vue';

export let router: Router;

export function generateRouter(history: RouterHistory) {
  router = createRouter({
    history,
    routes: [
      {
        path: '/',
        name: 'overview',
        component: OverviewVue
      },
      {
        path: '/dashboardSettings',
        name: 'dashboardSettings',
        component: DashboardSettingsVue,
      },
      {
        path: '/router/siteMap',
        name: 'siteMap',
        component: SiteMapVue,
      },
      {
        path: '/router/staticFileManager',
        name: 'staticFileManager',
        component: StaticFileManagerVue,
      },
      {
        path: '/router/routeRule',
        name: 'routeRule',
        component: RouteRuleVue,
      },
      {
        path: '/router/auditRule',
        name: 'auditRule',
        component: AuditRuleVue,
      },
      {
        path: '/service/moduleManager',
        name: 'moduleManager',
        component: ModuleManagerVue,
      },
      {
        path: '/service/dataSourceManager',
        name: 'dataSourceManager',
        component: DataSourceManagerVue,
      },
      {
        path: '/service/aggregateManager',
        name: 'aggregateManager',
        component: AggregateManagerVue,
      },
      { path: '/:pathMatch(.*)*', redirect: '/' }
    ]
  });

  router.beforeEach((to, from) => {
    if (
      (typeof to.name !== 'undefined' &&
        typeof from.name !== 'undefined' &&
        to.name !== from.name) ||
      to.fullPath !== to.fullPath
    ) {
      const store = useStoreForLayout();
      store.toggleRouting(true);
    }
    return true;
  });
  router.afterEach((to, from) => {
    if (
      (typeof to.name !== 'undefined' &&
        typeof from.name !== 'undefined' &&
        to.name !== from.name) ||
      to.fullPath !== to.fullPath
    ) {
      const store = useStoreForLayout();
      store.toggleRouting(false);
    }
  });
  router.push({ name: 'overview'});

  return router;
}
