import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { signSaltPassword } from '../authVerifyTools';

if (!existsSync(join(process.cwd(), './pneumatic.config.json'))) {
  writeFileSync(
    join(process.cwd(), './pneumatic.config.json'),
    JSON.stringify({
      admin: signSaltPassword('admin', 'admin')
    })
  );
}
export const accounts = JSON.parse(
  readFileSync(join(process.cwd(), './pneumatic.config.json'), 'utf8')
);
