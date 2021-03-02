import React, { createContext, useState, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';
import { css } from '@emotion/css';

import { wsSocket } from './authProviderContext';
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
  appRegistryStatus: string[],
  getAppComponent: IGetAppComponent,
  pushApp: IPushApp
}

declare global {
  interface Window {
    __applications: {
      [id: string]: { [page: string]: (props: any) => React.Component }
    },
    __applicationIdMap: {
      [pkg: string]: string
    }
  }
}

export function ApplicationProvider({ children }: { children?: any }) {
  const [apps, setApps]: [IApps, (apps: IApps) => void] = useState({});
  const [appRegistryStatus, setAppRegistryStatus]: [
    string[], (str: string[]) => void
  ] = useState([]);

  useEffect(() => {
    wsSocket.send('#get-applications');
    wsSocket.receive('#get-applications', data => {
      setApps({
        ...apps,
        ...data
      });
    });
  }, []);

  return <ApplicationProviderContext.Provider value={{
    apps, appRegistryStatus,
    getAppComponent(pkg: string, page: string = 'default') {
      const id = window.__applicationIdMap[pkg];
      if (!id) {
        throw Error(`Cannot find the application '${pkg}'.`);
      }

      if (appRegistryStatus.indexOf(pkg) < 0) {
        let node = document.createElement('script');
        node.src = `/${window.__applicationIdMap[pkg]}`;
        document.body.appendChild(node);

        const handler = setInterval(() => {
          if (window.__applications[id]) {
            clearInterval(handler);
            setAppRegistryStatus([...appRegistryStatus, pkg]);
          }
        }, 1000);

        return () => <div className={css`
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        `}>
          <CircularProgress />
        </div>;
      } else {
        return window.__applications[id]?.components[page];
      }
    },
    pushApp(pkg: string, app: IApp) { setApps({ ...apps, [pkg]: app }); }
  }}>
    {children}
  </ApplicationProviderContext.Provider >;
}
