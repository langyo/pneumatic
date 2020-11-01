/// <reference types="node" />

import { join } from 'path';
import { Writable } from 'stream';
import * as chalk from 'chalk';
import * as Koa from 'koa';
import * as bodyParserMiddleware from 'koa-bodyparser';

import {
  vmLoader,
  webpackCompiler,
  dirWatcher,
  dirScanner
} from 'nickelcat-dev-server';

let routeTasks: {
  match: ({ path: string, query: { [key: string]: string } }),
  call: (stream: Writable) => Promise<void>
}[] = [];
let staticSPACodes: { [route: string]: string } = {};

function parseRoute() { }
function parseFrontend() { }
function parseBackend() { }
function routeStaticFile() { }
function routeStaticFrontend() { }

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
