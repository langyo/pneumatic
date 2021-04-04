import React, { createContext, useState, useEffect } from 'react';
import { css } from '@emotion/css';

import { wsSocket } from './authProviderContext';
import { ISharedState, IWindowInfo } from './taskManagerContext';

export interface IApp {
  icon: string,   // SVG path.
  name: string,
  id: string
}

export type IAppComponent = (props: any) => React.Component | any;
export interface IAppDefaultInfo {
  page?: string,
  state?: (
    page: string, sharedState: ISharedState
  ) => ({ [key: string]: string }),
  windowInfo?: {
    [key in keyof IWindowInfo]?: (
      page: string, sharedState: ISharedState
    ) => IWindowInfo[key]
  }
}

export type IApps = { [pkg: string]: IApp };
export type IGetAppComponent = (pkg: string, page?: string) => IAppComponent;
export type IPushApp = (pkg: string, app: IApp) => void;

export const AppProviderContext = createContext({} as IAppProviderContext);

export interface IAppProviderContext {
  apps: IApps,
  loadAppComponent: IGetAppComponent,
  pushApp: IPushApp
}

export function AppProvider({ children }: { children?: any }) {
  const [apps, setApps]: [IApps, (apps: IApps) => void] = useState({});

  useEffect(() => {
    wsSocket.send('#get-apps');
    wsSocket.receive('#get-apps', ({ apps }) => setApps(apps));
  }, []);

  return <AppProviderContext.Provider value={{
    apps,
    loadAppComponent(pkg: string, page: string = 'default') {
      const id = apps[pkg].id;
      if (!id) {
        throw Error(`Cannot find the app '${pkg}'.`);
      }
      return <iframe
        className={css`
          border: 0px;
          margin: 0px;
          width: 100%;
          height: 100%;
        `}
        src={`/${apps[pkg].id}?page=${page}`}
      />;
    },
    pushApp(pkg: string, app: IApp) { setApps({ ...apps, [pkg]: app }); }
  }}>
    {children}
  </AppProviderContext.Provider >;
}
