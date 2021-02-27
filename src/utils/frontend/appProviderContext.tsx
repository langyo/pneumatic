import React, { createContext, useState } from 'react';
import { CircularProgress } from '@material-ui/core';
import {
  mdiFolderOutline, mdiMemory,
  mdiWeb, mdiDatabase, mdiFormatListChecks,
  mdiConsole, mdiPaletteOutline, mdiApps, mdiCogOutline
} from '@mdi/js';
import { css } from '@emotion/css';

import { IState, ITaskInfo, IWindowInfo } from './taskManagerContext';

export interface IApp {
  icon: string,   // SVG path.
  name: string,
  defaultPage?: string,
  defaultState?: { [key: string]: string }
  defaultWindowInfo?: {
    [key in keyof IWindowInfo]?: (
      page: string, state: IState, tasks: ITaskInfo
    ) => IWindowInfo[key]
  }
}

export type IApps = { [pkg: string]: IApp };
export type IGetAppComponent = (pkg: string, page?: string) => (props: any) => React.Component | any;
export type IPushApp = (pkg: string, app: IApp) => void;

export const ApplicationProviderContext = createContext({} as IApplicationProviderContext);

export interface IApplicationProviderContext {
  apps: IApps,
  getAppComponent: IGetAppComponent,
  pushApp: IPushApp
}

let appCache: {
  [pkg: string]: { [page: string]: (props: any) => React.Component }
} = {};

export function ApplicationProvider({ children }: { children?: any }) {
  const [apps, setApps]: [IApps, (apps: IApps) => void] = useState({
    'pneumatic.explorer': {
      icon: mdiFolderOutline, name: 'Explorer',
      defaultState: { path: '/' },
      defaultWindowInfo: { title: (_page, { path }) => path }
    },
    'pneumatic.monitor': {
      icon: mdiMemory, name: 'Monitor',
      defaultPage: 'hardware',
      defaultWindowInfo: { title: (_page, _data) => 'Hardware' }
    },
    'pneumatic.browser': {
      icon: mdiWeb, name: 'Proxy browser',
      defaultState: { url: 'https://github.com/' },
      defaultWindowInfo: { title: (_page, { url }) => /^https?:\/\/([^\/]+)\/.*/.exec(url)[1] }
    },
    'pneumatic.database': {
      icon: mdiDatabase, name: 'Database manager'
    },
    'pneumatic.plan': {
      icon: mdiFormatListChecks, name: 'Plan tasks'
    },
    'pneumatic.terminal': {
      icon: mdiConsole, name: 'Terminal'
    },
    'pneumatic.theme': {
      icon: mdiPaletteOutline, name: 'Theme setting'
    },
    'pneumatic.market': {
      icon: mdiApps, name: 'Application market'
    },
    'pneumatic.setting': {
      icon: mdiCogOutline, name: 'Setting'
    }
  } as IApps);

  return <ApplicationProviderContext.Provider value={{
    apps,
    getAppComponent(pkg: string, page: string = 'default') {
      if (appCache[pkg] && appCache[pkg][page]) {
        return appCache[pkg][page];
      } else {
        import(pkg).then(module => {
          console.log(`The application '${pkg}' has loaded.`);
          appCache[pkg] = module;
        }).catch(e => console.error(e));
        return () => <div className={css`
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        `}>
          <CircularProgress />
        </div>;
      }
    },
    pushApp(pkg: string, app: IApp) { setApps({ ...apps, [pkg]: app }); }
  }}>
    {children}
  </ApplicationProviderContext.Provider>;
}
