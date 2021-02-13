import React, { createContext, useState } from 'react';
import {
  mdiFolderOutline, mdiMemory,
  mdiWeb, mdiDatabase, mdiFormatListChecks,
  mdiConsole, mdiPaletteOutline, mdiApps
} from '@mdi/js';

import { ExplorerContent } from '../apps/explorer/views/content';
import { ExplorerDrawer } from '../apps/explorer/views/drawer';
import { MonitorContentMap } from '../apps/monitor/views/content';
import { MonitorDrawer } from '../apps/monitor/views/drawer';
import { BrowserContent } from '../apps/browser/views/content';
import { BrowserDrawer } from '../apps/browser/views/drawer';
import { DatabaseContent } from '../apps/database/views/content';
import { DatabaseDrawer } from '../apps/database/views/drawer';
import { PlanContent } from '../apps/plan/views/content';
import { PlanDrawer } from '../apps/plan/views/drawer';
import { TerminalContent } from '../apps/terminal/views/content';
import { TerminalDrawer } from '../apps/terminal/views/drawer';
import { ThemeContent } from '../apps/theme/views/content';
import { ThemeDrawer } from '../apps/theme/views/drawer';
import { MarketContent } from '../apps/market/views/content';
import { MarketDrawer } from '../apps/market/views/drawer';

import { IState, ITaskInfo } from './taskManagerContext';

export interface IApp {
  icon: string,   // SVG path.
  name: string,
  contentComponent: { [key: string]: (props: any) => React.Component },
  drawerComponent: { [key: string]: (props: any) => React.Component },
  defaultPage?: string,
  defaultState?: { [key: string]: string }
  defaultWindowInfo?: {
    top?: (page: string, state: IState, tasks: ITaskInfo) => number,
    left?: (page: string, state: IState, tasks: ITaskInfo) => number,
    width?: (page: string, state: IState, tasks: ITaskInfo) => number,
    height?: (page: string, state: IState, tasks: ITaskInfo) => number,
    title?: (page: string, state: IState, tasks: ITaskInfo) => string
  }
}

export const defaultApp: { [pkg: string]: IApp } = {
  'pneumatic.explorer': {
    icon: mdiFolderOutline, name: 'Explorer',
    contentComponent: { default: ExplorerContent },
    drawerComponent: { default: ExplorerDrawer },
    defaultState: { path: '/' },
    defaultWindowInfo: { title: (_page, { path }) => path }
  },
  'pneumatic.monitor': {
    icon: mdiMemory, name: 'Monitor',
    contentComponent: MonitorContentMap,
    drawerComponent: { default: MonitorDrawer },
    defaultPage: 'hardware',
    defaultWindowInfo: { title: (page, _data) => page }
  },
  'pneumatic.browser': {
    icon: mdiWeb, name: 'Proxy browser',
    contentComponent: { default: BrowserContent },
    drawerComponent: { default: BrowserDrawer },
    defaultState: { url: 'https://github.com/' },
    defaultWindowInfo: { title: (_page, { url }) => /^https?:\/\/([^\/]+)\/.*/.exec(url)[1] }
  },
  'pneumatic.database': {
    icon: mdiDatabase, name: 'Database manager',
    contentComponent: { default: DatabaseContent },
    drawerComponent: { default: DatabaseDrawer }
  },
  'pneumatic.plan': {
    icon: mdiFormatListChecks, name: 'Plan tasks',
    contentComponent: { default: PlanContent },
    drawerComponent: { default: PlanDrawer }
  },
  'pneumatic.terminal': {
    icon: mdiConsole, name: 'Terminal',
    contentComponent: { default: TerminalContent },
    drawerComponent: { default: TerminalDrawer }
  },
  'pneumatic.theme': {
    icon: mdiPaletteOutline, name: 'Theme setting',
    contentComponent: { default: ThemeContent },
    drawerComponent: { default: ThemeDrawer }
  },
  'pneumatic.market': {
    icon: mdiApps, name: 'Application market',
    contentComponent: { default: MarketContent },
    drawerComponent: { default: MarketDrawer }
  }
};

export const ApplicationProviderContext = createContext({});

export function ApplicationProvider(props) {
  const [apps, setApps] = useState(defaultApp);

  return <ApplicationProviderContext.Provider value={{
    apps,
    pushApp(pkg: string, app: IApp) { setApps({ ...apps, [pkg]: app }); }
  }}>
    {props.children}
  </ApplicationProviderContext.Provider>;
}
