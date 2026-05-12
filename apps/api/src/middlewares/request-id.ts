import type { Middleware } from 'koa';
import { randomUUID } from 'node:crypto';

export const requestId: Middleware = async (ctx, next) => {
  const id = ctx.get('x-request-id') || randomUUID();
  ctx.state.requestId = id;
  ctx.set('x-request-id', id);
  await next();
};
