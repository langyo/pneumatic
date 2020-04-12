import React from 'react';
import { hydrate } from 'react-dom';
import {
  connect,
  register,
  buildRootNode
} from './lib'

import IndexComponent from './components/index';
import indexController from './controllers/index';

import OverviewPage from './components/overviewPage';
import overviewPageCtx from './controllers/overviewPage';
connect(OverviewPage, overviewPageCtx, 'overview')

import FetchPage from './components/fetchPage';
import fetchPageCtx from './controllers/fetchPage';
connect(FetchPage, fetchPageCtx, 'fetch');

import ParsePage from './components/parsePage';
import parsePageCtx from './controllers/parsePage';
connect(ParsePage, parsePageCtx, 'parse');

import StatusPage from './components/statusPage';
import statusPageCtx from './controllers/statusPage';
connect(StatusPage, statusPageCtx, 'status');

import CreateNewTaskDialog from './components/dialogs/createNewTask';
import createNewTaskDialogCtx from './controllers/dialogs/createNewTask';
connect(CreateNewTaskDialog, createNewTaskDialogCtx, 'createNewTaskDialog');

import FetchConfigDialog from './components/dialogs/fetchConfig';
import fetchConfigDialogCtx from './controllers/dialogs/fetchConfig';
connect(FetchConfigDialog, fetchConfigDialogCtx, 'fetchConfigDialog');

import ParseConfigDialog from './components/dialogs/parseConfig';
import parseConfigDialogCtx from './controllers/dialogs/parseConfig';
connect(ParseConfigDialog, parseConfigDialogCtx, 'parseConfigDialog');

import AboutDialog from './components/dialogs/about';
import aboutDialogCtx from './controllers/dialogs/about';
connect(AboutDialog, aboutDialogCtx, 'aboutDialog');

register('overview', {}, '$page');

hydrate(buildRootNode(IndexComponent, indexController, {
  initializing: true,
  $page: 'overview',

  tasks: {
    'MCBBS': {
      status: 'sleep',
      fetch: [
        {
          title: '主页',
          rule: {
            type: 'static',
            href: 'https://www.mcbbs.net/forum.php'
          },
          interval: {
            min: 30
          },
          parseCode: '() => ({ degree: +$("#category_50 > table > tbody > tr:nth-child(1) > td:nth-child(2) > h2 > em").innerText, time: (new Date()).toLocaleTimeString() })'
        }
      ],
      parse: [
        {
          title: '茶馆活跃度感知',
          type: 'line-chart',
          sourceTable: 'forumTable',
          rules: {
            xAxis: 'time',
            yAxis: 'degree'
          }
        }
      ],
      data: {
        'forumTable': [
          {
            time: '06:00',
            degree: 2023
          }, {
            time: '06:30',
            degree: 2087
          }, {
            time: '07:00',
            degree: 1970
          }, {
            time: '07:30',
            degree: 1543
          }, {
            time: '08:00',
            degree: 1992
          }
        ]
      }
    }
  },
  account: {}
}), document.querySelector('#root'));

