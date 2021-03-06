import { Content } from './views/content';
import { Drawer } from './views/drawer';

export const pages = {
  default: Content,
  drawer: Drawer
};

export const config = {
  defaultInfo: {
    state: () => ({ url: 'https://github.com/' }),
    windowInfo: {
      title: (_page, { url }) => /^https?:\/\/([^\/]+)\/.*/.exec(url)[1]
    }
  }
};

