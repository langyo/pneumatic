import {
  connect,
  initRoutes,
  getRoutes
} from '../server';
import { loadActionModel } from '../client';
import initState from '../../configs/initState';

const { components, services } = require('./.requirePackages.js');

import presetActionPackage from '../action-preset';
loadActionModel(presetActionPackage);

for (const name of Object.keys(components).filter(name => name !== 'index')) {
  connect(components[name].component.default, components[name].controller.default, name);
}

import extraConfigs from '../../configs';
initRoutes(extraConfigs);

import { router } from '../server';
import { childCreator } from './childProcessCreator';

import { renderToString } from 'react-dom/server';
import { ServerStyleSheets } from '@material-ui/core/styles';

if (!components.index) throw new Error('TODO: Support the multi pages without the route index component.');
childCreator(async ({
  type,
  payload,
  configs
}) => await router(type, payload, getRoutes(), {
  ...configs,
  ...extraConfigs,
  rootGuide: {
    rootComponent: components.index.component.default,
    rootController: components.index.controller.default,
    initState,
    headProcessor: node => {
      const sheets = new ServerStyleSheets();
      const html = renderToString(sheets.collect(node));
      return {
        renderHTML: html,
        renderCSS: {
          'ssr-css': sheets.toString()
        }
      }
    }
  }
}));
