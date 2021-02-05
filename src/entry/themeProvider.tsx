import React, { createContext } from 'react';

export const ThemeProviderContext = createContext({});

import {
  mdiFolderOutline, mdiMemory, mdiApplication,
  mdiWeb, mdiDatabase, mdiFormatListChecks,
  mdiConsole, mdiPaletteOutline, mdiApps
} from "@mdi/js";

export const defaultAppIconMap = {
  guide: { iconPath: mdiApplication, title: "Guide" },
  explorer: { iconPath: mdiFolderOutline, title: "Explorer" },
  monitor: { iconPath: mdiMemory, title: "Monitor" },
  browser: { iconPath: mdiWeb, title: "Proxy Web Browser" },
  database: { iconPath: mdiDatabase, title: "Database manager" },
  plan: { iconPath: mdiFormatListChecks, title: "Plan tasks" },
  terminal: { iconPath: mdiConsole, title: "Terminal" },
  theme: { iconPath: mdiPaletteOutline, title: "Theme setting" },
  market: { iconPath: mdiApps, title: "Application market" }
};