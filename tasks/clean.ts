import { series } from 'gulp';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import del from 'del';

export const clean = series(
  async function removeFiles() {
    await del([join(process.cwd(), './dist')]);
  },

  async function regenerateEmptyFolder() {
    try {
      await mkdir(join(process.cwd(), './dist'), { recursive: true });
    } catch {
      return;
    }
  }
);
