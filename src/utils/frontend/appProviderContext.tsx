import React, { createContext, useState, useEffect } from 'react';

import { wsSocket } from './authProviderContext';
import { ISharedState, ITaskMap, IWindowInfo } from './taskManagerContext';

export interface IApp {
  icon: string,   // SVG path.
  name: string
}

export interface IAppDefaultInfo {
  page?: string,
  state?: (
    page: string, sharedState: ISharedState, tasks: ITaskMap
  ) => ({ [key: string]: string }),
  windowInfo?: {
    [key in keyof IWindowInfo]?: (
      page: string, sharedState: ISharedState, tasks: ITaskMap
    ) => IWindowInfo[key]
  }
}

export type IApps = { [pkg: string]: IApp };
export type IGetAppComponent = (pkg: string, page?: string) => (props: any) => React.Component | any;
export type IGetAppDefaultInfo = (
  pkg: string, currentPage: string, initState: { [key: string]: any }, tasks: ITaskMap
) => Partial<IAppDefaultInfo>;
export type IPushApp = (pkg: string, app: IApp) => void;

export const AppProviderContext = createContext({} as IAppProviderContext);

export interface IAppProviderContext {
  apps: IApps,
  appRegistryStatus: string[],
  getAppComponent: IGetAppComponent,
  getAppDefaultInfo: IGetAppDefaultInfo,
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
    getAppDefaultInfo(
      pkg: string,
      currentPage: string, initState: { [key: string]: any }, tasks: ITaskMap
    ): IAppDefaultInfo {
      const id = window.__appIdMap[pkg];
      if (!id) {
        throw Error(`Cannot find the app '${pkg}'.`);
      }

      let { page, state, windowInfo } = window.__apps[id]?.config?.defaultInfo || {};
      let ret = {};
      if (page) {
        ret = { ...ret, page };
      }
      if (state) {
        ret = { ...ret, state: state(currentPage, initState, tasks) };
      }
      if (windowInfo) {
        ret = {
          ...ret, windowInfo: {
            ...Object.keys(windowInfo).reduce((obj, key) => ({
              ...obj,
              [key]: windowInfo[key](currentPage, initState, tasks)
            }), {})
          }
        };
      }
      return ret;
    },
    pushApp(pkg: string, app: IApp) { setApps({ ...apps, [pkg]: app }); }
  }}>
    {children}
  </AppProviderContext.Provider >;
}
