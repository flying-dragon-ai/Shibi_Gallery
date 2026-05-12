import type { Middleware } from 'koa';
import pino from 'pino';

export const logger = pino({ name: 'shibi-api' });

export const requestLogger: Middleware = async (ctx, next) => {
  const startedAt = Date.now();
  await next();
  logger.info({
    requestId: ctx.state.requestId,
    method: ctx.method,
    path: ctx.path,
    status: ctx.status,
    durationMs: Date.now() - startedAt
  });
};
