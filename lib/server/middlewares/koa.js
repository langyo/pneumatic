import { fork } from 'child_process';
import { resolve } from 'path';

export default async (ctx, next) => {
  ctx.response.type = '';
};
