import type { Middleware } from 'koa';
import { ZodError } from 'zod';

export const errorHandler: Middleware = async (ctx, next) => {
  try {
    await next();
    if (ctx.status === 404 && ctx.body == null) {
      ctx.status = 404;
      ctx.body = {
        error: { code: 'NOT_FOUND', message: '接口不存在' },
        requestId: ctx.state.requestId
      };
    }
  } catch (error) {
    if (error instanceof ZodError) {
      ctx.status = 400;
      ctx.body = {
        error: { code: 'VALIDATION_ERROR', message: '请求参数不合法', details: error.flatten() },
        requestId: ctx.state.requestId
      };
      return;
    }

    const err = error as Error & { status?: number; expose?: boolean; code?: string };
    ctx.status = err.status ?? 500;
    ctx.body = {
      error: {
        code: err.code ?? (ctx.status >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR'),
        message: err.expose || ctx.status < 500 ? err.message : '服务器内部错误'
      },
      requestId: ctx.state.requestId
    };
    ctx.app.emit('error', err, ctx);
  }
};
