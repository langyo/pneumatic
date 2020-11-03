/// <reference types="node" />

import { join } from 'path';
import { Writable } from 'stream';
import * as chalk from 'chalk';
import * as Koa from 'koa';
import * as bodyParserMiddleware from 'koa-bodyparser';

import { vmLoader } from './virtualMachineLoader';
import { webpackCompiler } from './webpackLoader';
import { dirWatcher } from './dirWatcher';

let routeTasks: {
  [id: number]: {
    match: ({ path: string, query: { [key: string]: string } }),
    call: (stream: Writable) => Promise<void>
  }
} = {};
let staticSPACodes: { [route: string]: string } = {};

function parseFrontend({ component, preload }, routePath: string) {

}

function parseBackend({ matcher, level, service, protocol }, routePath: string) {

}

function routeStaticFile(path, routePath) { }
function routeStaticFrontend(path, routePath) { }

// Watch the frontend part.
dirWatcher(
  join(process.cwd(), './public/frontend'),
  async diffPaths => {
    for (const { path, type, route } of diffPaths) {
      console.log(`${type}: ${path} ${route}`);
    }
  }
);

// Watch the backend part.
dirWatcher(
  join(process.cwd(), './public/backend'),
  async diffPaths => {
    for (const { path, type, route } of diffPaths) {
      console.log(`${type}: ${path} ${route}`);
    }
  }
);

// Watch the routes part.
dirWatcher(
  join(process.cwd(), './public/routes'),
  async diffPaths => {
    for (const { path, type, route } of diffPaths) {
      console.log(`${type}: ${path} ${route}`);
    }
  }
);

const app = new Koa();

app.use(bodyParserMiddleware());

app.use(async (ctx: Koa.BaseContext, next: () => Promise<any>) => {

  await next();
});

app.listen(+process.env.PORT || 80, process.env.HOST || undefined);
