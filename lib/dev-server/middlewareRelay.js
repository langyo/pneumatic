import { createReadStream } from 'fs';

export default ({
  sendFunc,
  libType = 'koa',
  renderFilePath,
  routePath = '/spa.js'
}) => {
  if (typeof sendFunc !== 'function') throw new Error('You must provide a function to exchange the data between two models.');

  switch (libType) {
    case 'koa':
      return async (ctx, next) => {
        if (ctx.request.path === routePath) {
          ctx.response.body = createReadStream(renderFilePath);
          return;
        }

        const { successFlag, payload: { type, body, statusCode } } = await sendFunc({
          type: 'http',
          payload: {
            ip: ctx.request.ip,
            path: ctx.request.path,
            query: ctx.request.query,
            host: ctx.request.host,
            charset: ctx.request.charset,
            protocol: ctx.request.protocol,
            type: ctx.request.type,
            cookies: ctx.request.cookies,
            body: ctx.request.body
          },
          configs: {
            staticClientPath: routePath
          }
        });

        if (successFlag) {
          ctx.response.type = type;
          ctx.response.body = body;
          ctx.response.status = statusCode;
          await next();
        } else {
          await next();
        }
      };
    default:
      throw new Error(`Unsupported library type: ${libType}`);
  }
}