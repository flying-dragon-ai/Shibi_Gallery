import type { Middleware } from 'koa';
import type { ZodSchema } from 'zod';

export function validateBody<T>(schema: ZodSchema<T>): Middleware {
  return async (ctx, next) => {
    ctx.request.body = schema.parse(ctx.request.body);
    await next();
  };
}

export function validateParams<T>(schema: ZodSchema<T>): Middleware {
  return async (ctx, next) => {
    ctx.params = schema.parse(ctx.params as unknown) as typeof ctx.params;
    await next();
  };
}
