import React, { createContext, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

export const ThemeProviderContext = createContext({});

import {
  mdiFolderOutline, mdiMemory, mdiApplication,
  mdiWeb, mdiDatabase, mdiFormatListChecks,
  mdiConsole, mdiPaletteOutline, mdiApps
} from "@mdi/js";

export const defaultAppInfo = {
  'pneumatic.guide': { iconPath: mdiApplication, name: "Guide" },
  'pneumatic.explorer': { iconPath: mdiFolderOutline, name: "Explorer" },
  'pneumatic.monitor': { iconPath: mdiMemory, name: "Monitor" },
  'pneumatic.browser': { iconPath: mdiWeb, name: "Proxy Web Browser" },
  'pneumatic.database': { iconPath: mdiDatabase, name: "Database manager" },
  'pneumatic.plan': { iconPath: mdiFormatListChecks, name: "Plan tasks" },
  'pneumatic.terminal': { iconPath: mdiConsole, name: "Terminal" },
  'pneumatic.theme': { iconPath: mdiPaletteOutline, name: "Theme setting" },
  'pneumatic.market': { iconPath: mdiApps, name: "Application market" }
};

export function ThemeProvider(props) {
  const [appInfo, setAppInfo] = useState(defaultAppInfo);
  const media = useMediaQuery({
    query: '(min-width: 992px)'
  }) ? 'desktop' : 'mobile';

  return <ThemeProviderContext.Provider value={{
    appInfo, media
  }}>
    {props.children}
  </ThemeProviderContext.Provider>
}
