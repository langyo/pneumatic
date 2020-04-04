import React from 'react';
import { hydrate } from 'react-dom';
import {
  connect,
  register,
  buildRootNode
} from './lib'

import Index from './components/index';
import indexCtr from './controllers/index';
connect(Index, indexCtr, 'index');

register('index', {}, 'index');

hydrate(buildRootNode({
  initializing: true,

  tasks: [],
  account: {}
}), document.querySelector('#root'));

