import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { signSaltPassword } from '../authVerifyTools';
import { IApp } from '../frontend/appProviderContext'

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
      }
    })
  );
}
export const config = JSON.parse(
  readFileSync(join(process.cwd(), './pneumatic.config.json'), 'utf8')
);
