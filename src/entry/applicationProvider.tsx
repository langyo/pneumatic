import React, { createContext, useState } from 'react';
import {
  mdiFolderOutline, mdiMemory, mdiApplication,
  mdiWeb, mdiDatabase, mdiFormatListChecks,
  mdiConsole, mdiPaletteOutline, mdiApps
} from "@mdi/js";

export interface IApp {
  icon: string,   // SVG path.
  name: string,
  // drawerComponent: () => ...
  // contentComponent: () => ...
}

export const defaultApp = {
  'pneumatic.guide': { icon: mdiApplication, name: "Guide" },
  'pneumatic.explorer': { icon: mdiFolderOutline, name: "Explorer" },
  'pneumatic.monitor': { icon: mdiMemory, name: "Monitor" },
  'pneumatic.browser': { icon: mdiWeb, name: "Proxy Web Browser" },
  'pneumatic.database': { icon: mdiDatabase, name: "Database manager" },
  'pneumatic.plan': { icon: mdiFormatListChecks, name: "Plan tasks" },
  'pneumatic.terminal': { icon: mdiConsole, name: "Terminal" },
  'pneumatic.theme': { icon: mdiPaletteOutline, name: "Theme setting" },
  'pneumatic.market': { icon: mdiApps, name: "Application market" }
};

export const ApplicationProviderContext = createContext({});

export function ApplicationProvider(props) {
  const [apps, setApps] = useState(defaultApp);

  return <ApplicationProviderContext.Provider value={apps}>
    {props.children}
  </ApplicationProviderContext.Provider>
}
