import { Content } from './views/content';
import { Drawer } from './views/drawer';

export const pages = {
  default: Content,
  drawer: Drawer
};

export const config = {
  defaultInfo: {
    state: () => ({ path: process.cwd(), files: {}, baseName: '' }),
    windowInfo: {
      title: (_page, { path }) => path
    }
  }
};
