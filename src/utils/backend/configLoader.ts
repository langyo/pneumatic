import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { signSaltPassword } from '../authVerifyTools';
import { IApp } from '../frontend/appProviderContext'

import {
  mdiFolderOutline, mdiMemory,
  mdiWeb, mdiDatabase, mdiFormatListChecks,
  mdiConsole, mdiPaletteOutline, mdiApps, mdiCogOutline
} from '@mdi/js';

export interface IConfig {
  accounts: {
    [name: string]: {
      password: string
    }
  },
  apps: {
    [pkg: string]: IApp
  }
}

if (!existsSync(join(process.cwd(), './pneumatic.config.json'))) {
  writeFileSync(
    join(process.cwd(), './pneumatic.config.json'),
    JSON.stringify({
      accounts: {
        admin: {
          password: signSaltPassword('admin', 'admin')
        }
      },
      apps: {
        'pneumatic.explorer': {
          icon: mdiFolderOutline, name: 'Explorer'
        },
        'pneumatic.monitor': {
          icon: mdiMemory, name: 'Monitor'
        },
        'pneumatic.browser': {
          icon: mdiWeb, name: 'Proxy browser'
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
      }
    })
  );
}
export const config = JSON.parse(
  readFileSync(join(process.cwd(), './pneumatic.config.json'), 'utf8')
);
