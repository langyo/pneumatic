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

register('overview', { }, '$page');

hydrate(buildRootNode(IndexComponent, indexController, {
  initializing: true,
  $page: 'overview',

  tasks: {
    'MCBBS': {
      status: 'sleep',
      fetch: [
        {
          title: 'forum',
          rule: {
            type: 'static',
            href: 'https://www.mcbbs.net/forum.php'
          },
          interval: {
            min: 30
          }
        }
      ],
      analyze: [
        {
          source: [
            {
              type: 'static',
              href: 'https://www.mcbbs.net/forum.php'
            }
          ],
          target: {
            title: '茶馆活跃度感知',
            type: 'single-var-line-chart',
            rule: {
              xAxis: 'time',
              yAxis: 'degree'
            },
            parseCode: '() => ({ degree: +$("#category_50 > table > tbody > tr:nth-child(1) > td:nth-child(2) > h2 > em").innerText, time: (new Date()).toLocaleTimeString() })'
          },
          bind: [
            'forum'
          ],
          data: [
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
      ]
    }
  },
  account: {}
}), document.querySelector('#root'));

