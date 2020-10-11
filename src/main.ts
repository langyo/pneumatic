/// <reference types="node" />

import * as chalk from 'chalk';

import * as Koa from 'koa';
import * as bodyParserMiddleware from 'koa-bodyparser';
import {
  IRequestForwardObjectType
} from 'nickelcat-dev-server';

import { build, send } from 'nickelcat-dev-server/vmLoader';
import { webpackCompilerFactory } from 'nickelcat-dev-server/webpackLoader';
import { staticDepsBuilder } from 'nickelcat-dev-server/staticDepsBuilder';
import { dirWatcher } from 'nickelcat-dev-server/dirWatcher';

import { join } from 'path';

let clientBundleContent: string = '';

const webpackClientSideFunc = webpackCompilerFactory(
  join(process.cwd(), './src/SPAEntry.ts'),
  'web'
);
const webpackServerSideFunc = webpackCompilerFactory(
  join(process.cwd(), './src/SSREntry.ts'),
  'node'
);

dirWatcher(async () => {
  clientBundleContent = (await webpackClientSideFunc(staticDepsBuilder(
    join(process.cwd(), './src/')
  ))).code;
  build(await webpackServerSideFunc(staticDepsBuilder(
    join(process.cwd(), './src/')
  )));
});

const app = new Koa();

app.use(bodyParserMiddleware());

app.use(async (ctx: Koa.BaseContext, next: () => Promise<any>) => {
  const { status, code, type, body }: IRequestForwardObjectType =
    await send({
      ip: ctx.ip,
      path: ctx.path,
      query: ctx.query,
      host: ctx.host,
      protocol: ctx.protocol,
      cookies: {
        // BUG - The type declaration file has not defined 'cookies'
        get: (ctx as any).cookies.get,
        set: (ctx as any).cookies.set
      }
    });

  if (status === 'processed') {
    ctx.type = type;
    ctx.body = body;
    ctx.status = code;
  }
  await next();
});

app.listen(+process.env.PORT || 80, process.env.HOST || undefined);
