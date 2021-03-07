import React, { createContext, useState, useEffect } from 'react';

import { wsSocket } from './authProviderContext';
import { ISharedState, ITaskMap, IWindowInfo } from './taskManagerContext';

export interface IApp {
  icon: string,   // SVG path.
  name: string
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
  appRegistryStatus: string[],
  getAppComponent: IGetAppComponent,
  pushApp: IPushApp
}

declare global {
  // tslint:disable-next-line: interface-name
  interface Window {
    __apps: {
      [id: string]: {
        pages: {
          [page: string]: (props: any) => React.Component
        },
        config?: {
          defaultInfo?: IAppDefaultInfo
        }
      }
    },
    __appIdMap: {
      [pkg: string]: string
    }
  }
}

export function AppProvider({ children }: { children?: any }) {
  const [apps, setApps]: [IApps, (apps: IApps) => void] = useState({});
  const [appRegistryStatus, setAppRegistryStatus]: [
    string[], (str: string[]) => void
  ] = useState([]);

  useEffect(() => {
    wsSocket.send('#get-apps');
    wsSocket.receive('#get-apps', ({ apps }) => {
      setApps(apps);
    });
  }, []);

  return <AppProviderContext.Provider value={{
    apps, appRegistryStatus,
    getAppComponent(pkg: string, page: string = 'default') {
      const id = window.__appIdMap[pkg];
      if (!id) {
        throw Error(`Cannot find the app '${pkg}'.`);
      }

      if (appRegistryStatus.indexOf(pkg) < 0) {
        let node = document.createElement('script');
        node.src = `/${window.__appIdMap[pkg]}`;
        document.body.appendChild(node);

        const handler = setInterval(() => {
          if (window.__apps[id]) {
            clearInterval(handler);
            setAppRegistryStatus([...appRegistryStatus, pkg]);
          }
        }, 200);

        return;
      } else {
        return window.__apps[id]?.pages[page];
      }
    },
    pushApp(pkg: string, app: IApp) { setApps({ ...apps, [pkg]: app }); }
  }}>
    {children}
  </AppProviderContext.Provider >;
}
