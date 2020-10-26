/// <reference types="node" />

import { join } from 'path';
import { Writable } from 'stream';
import * as chalk from 'chalk';
import * as Koa from 'koa';
import * as bodyParserMiddleware from 'koa-bodyparser';

import {
  vmLoader,
  webpackCompiler,
  dirWatcher
} from 'nickelcat-dev-server';

let routeTasks: { match: RegExp, call: (stream: Writable) => Promise<void> }[] = [];
let staticSPACodes: { [route: string]: string } = {};

function parseRoute() { }
function parseComponent() { }
function parseService() { }
function routeStatic() { }
function routeStaticComponent() { }

dirWatcher(
  join(process.cwd(), './public'),
  async (diffPaths: { path: string, type: string }[]) => {

  }
);

const app = new Koa();

app.use(bodyParserMiddleware());

app.use(async (ctx: Koa.BaseContext, next: () => Promise<any>) => {

  await next();
});

app.listen(+process.env.PORT || 80, process.env.HOST || undefined);
