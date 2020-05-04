import { serverLog as log } from '../utils/logger';

export default ({ sendFunc, libType = 'koa', staticClientPath = './spa.js' }) => {
  switch (libType) {
    case 'koa':
      return async (ctx, next) => {
        log('debug', 'Path:', ctx.request.path);
        const { type, body } = await sendFunc({
          type: 'http',
          payload: {
            ip: ctx.request.ip,
            path: ctx.request.path,
            query: ctx.request.query,
            host: ctx.request.host,
            charset: ctx.request.charset,
            protocol: ctx.request.protocol,
            type: ctx.request.type,
            staticClientPath
          }
        });

        ctx.response.type = type;
        ctx.response.body = body;
        await next();
      };
    default:
      throw new Error(`Unsupported library type: ${libType}`);
  }
}