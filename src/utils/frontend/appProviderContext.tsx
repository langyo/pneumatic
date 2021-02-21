import React, { createContext, useState } from 'react';
import {
  mdiFolderOutline, mdiMemory,
  mdiWeb, mdiDatabase, mdiFormatListChecks,
  mdiConsole, mdiPaletteOutline, mdiApps, mdiCogOutline
} from '@mdi/js';

import { IState, ITaskInfo, IWindowInfo } from './taskManagerContext';

export interface IApp {
  icon: string,   // SVG path.
  name: string,
  path: string,
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
    path: 'explorer/frontend',
    defaultState: { path: '/' },
    defaultWindowInfo: { title: (_page, { path }) => path }
  },
  'pneumatic.monitor': {
    icon: mdiMemory, name: 'Monitor',
    path: 'monitor/frontend',
    defaultPage: 'hardware',
    defaultWindowInfo: { title: (_page, _data) => 'Hardware' }
  },
  'pneumatic.browser': {
    icon: mdiWeb, name: 'Proxy browser',
    path: 'browser/frontend',
    defaultState: { url: 'https://github.com/' },
    defaultWindowInfo: { title: (_page, { url }) => /^https?:\/\/([^\/]+)\/.*/.exec(url)[1] }
  },
  'pneumatic.database': {
    icon: mdiDatabase, name: 'Database manager',
    path: 'databse/frontend'
  },
  'pneumatic.plan': {
    icon: mdiFormatListChecks, name: 'Plan tasks',
    path: 'plan/frontend'
  },
  'pneumatic.terminal': {
    icon: mdiConsole, name: 'Terminal',
    path: 'terminal/frontend'
  },
  'pneumatic.theme': {
    icon: mdiPaletteOutline, name: 'Theme setting',
    path: 'theme/frontend'
  },
  'pneumatic.market': {
    icon: mdiApps, name: 'Application market',
    path: 'market/frontend'
  },
  'pneumatic.setting': {
    icon: mdiCogOutline, name: 'Setting',
    path: 'setting/frontend'
  },
};

export const ApplicationProviderContext = createContext({});

export function ApplicationProvider({ children }: { children?: any }) {
  const [apps, setApps] = useState(defaultApp);
  // TODO - Use code split and lazy load by webpack.

  return <ApplicationProviderContext.Provider value={{
    apps,
    pushApp(pkg: string, app: IApp) { setApps({ ...apps, [pkg]: app }); }
  }}>
    {children}
  </ApplicationProviderContext.Provider>;
}
