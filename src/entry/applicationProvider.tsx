import React, { createContext, useState } from 'react';
import {
  mdiFolderOutline, mdiMemory,
  mdiWeb, mdiDatabase, mdiFormatListChecks,
  mdiConsole, mdiPaletteOutline, mdiApps
} from "@mdi/js";

import { ExplorerContent } from '../explorer/content';
import { ExplorerDrawer } from '../explorer/drawer';
import { MonitorContentMap } from '../monitor/content';
import { MonitorDrawer } from '../monitor/drawer';
import { BrowserContent } from '../browser/content';
import { BrowserDrawer } from '../browser/drawer';
import { DatabaseContent } from '../database/content';
import { DatabaseDrawer } from '../database/drawer';
import { PlanContent } from '../plan/content';
import { PlanDrawer } from '../plan/drawer';
import { TerminalContent } from '../terminal/content';
import { TerminalDrawer } from '../terminal/drawer';
import { ThemeContent } from '../theme/content';
import { ThemeDrawer } from '../theme/drawer';
import { MarketContent } from '../market/content';
import { MarketDrawer } from '../market/drawer';

export interface IApp {
  icon: string,   // SVG path.
  name: string,
  contentComponent: { [key: string]: (props: any) => React.Component },
  drawerComponent: { [key: string]: (props: any) => React.Component }
}

export const defaultApp: { [pkg: string]: IApp } = {
  'pneumatic.explorer': {
    icon: mdiFolderOutline, name: "Explorer",
    contentComponent: { default: ExplorerContent },
    drawerComponent: { default: ExplorerDrawer }
  },
  'pneumatic.monitor': {
    icon: mdiMemory, name: "Monitor",
    contentComponent: MonitorContentMap,
    drawerComponent: {
      default: MonitorDrawer
    }
  },
  'pneumatic.browser': {
    icon: mdiWeb, name: "Proxy Web Browser",
    contentComponent: { default: BrowserContent },
    drawerComponent: { default: BrowserDrawer }
  },
  'pneumatic.database': {
    icon: mdiDatabase, name: "Database manager",
    contentComponent: { default: DatabaseContent },
    drawerComponent: { default: DatabaseDrawer }
  },
  'pneumatic.plan': {
    icon: mdiFormatListChecks, name: "Plan tasks",
    contentComponent: { default: PlanContent },
    drawerComponent: { default: PlanDrawer }
  },
  'pneumatic.terminal': {
    icon: mdiConsole, name: "Terminal",
    contentComponent: { default: TerminalContent },
    drawerComponent: { default: TerminalDrawer }
  },
  'pneumatic.theme': {
    icon: mdiPaletteOutline, name: "Theme setting",
    contentComponent: { default: ThemeContent },
    drawerComponent: { default: ThemeDrawer }
  },
  'pneumatic.market': {
    icon: mdiApps, name: "Application market",
    contentComponent: { default: MarketContent },
    drawerComponent: { default: MarketDrawer }
  }
};

export const ApplicationProviderContext = createContext({});

export function ApplicationProvider(props) {
  const [apps, setApps] = useState(defaultApp);

  return <ApplicationProviderContext.Provider value={apps}>
    {props.children}
  </ApplicationProviderContext.Provider>
}
