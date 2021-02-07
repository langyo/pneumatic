import React, { createContext, useState } from 'react';
import {
  mdiFolderOutline, mdiMemory,
  mdiWeb, mdiDatabase, mdiFormatListChecks,
  mdiConsole, mdiPaletteOutline, mdiApps
} from "@mdi/js";

import { ExplorerContent } from '../explorer/content';
import { ExplorerDrawer } from '../explorer/drawer';
import { MonitorContent } from '../monitor/content';
import { MonitorDrawer } from '../monitor/drawer';

export interface IApp {
  icon: string,   // SVG path.
  name: string,
  contentComponent: (props: any) => React.Component,
  drawerComponent: (props: any) => React.Component
}

export const defaultApp: { [pkg: string]: IApp } = {
  'pneumatic.explorer': {
    icon: mdiFolderOutline, name: "Explorer",
    contentComponent: ExplorerContent, drawerComponent: ExplorerDrawer
  },
  'pneumatic.monitor': {
    icon: mdiMemory, name: "Monitor",
    contentComponent: MonitorContent, drawerComponent: MonitorDrawer
  },
  'pneumatic.browser': {
    icon: mdiWeb, name: "Proxy Web Browser",
    contentComponent: () => <p>{'test content'}</p>, drawerComponent: () => <p>{'test drawer'}</p>
  },
  'pneumatic.database': {
    icon: mdiDatabase, name: "Database manager",
    contentComponent: () => <p>{'test content'}</p>, drawerComponent: () => <p>{'test drawer'}</p>
  },
  'pneumatic.plan': {
    icon: mdiFormatListChecks, name: "Plan tasks",
    contentComponent: () => <p>{'test content'}</p>, drawerComponent: () => <p>{'test drawer'}</p>
  },
  'pneumatic.terminal': {
    icon: mdiConsole, name: "Terminal",
    contentComponent: () => <p>{'test content'}</p>, drawerComponent: () => <p>{'test drawer'}</p>
  },
  'pneumatic.theme': {
    icon: mdiPaletteOutline, name: "Theme setting",
    contentComponent: () => <p>{'test content'}</p>, drawerComponent: () => <p>{'test drawer'}</p>
  },
  'pneumatic.market': {
    icon: mdiApps, name: "Application market",
    contentComponent: () => <p>{'test content'}</p>, drawerComponent: () => <p>{'test drawer'}</p>
  }
};

export const ApplicationProviderContext = createContext({});

export function ApplicationProvider(props) {
  const [apps, setApps] = useState(defaultApp);

  return <ApplicationProviderContext.Provider value={apps}>
    {props.children}
  </ApplicationProviderContext.Provider>
}
