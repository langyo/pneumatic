import React from 'react';
import { renderToString } from 'react-dom/server';
import {
  connect,
  register,
  buildRootNode
} from './lib';

import Index from './components/index';
import indexCtr from './controllers/index';
connect(Index, indexCtr, 'index');

register('index', {}, 'index');

export default (initState = {}) => renderToString(buildRootNode(initState));

