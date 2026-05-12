import Router from '@koa/router';
import type { ApiResponse } from '@shibi/shared';

export const healthRouter = new Router({ prefix: '/api' });

healthRouter.get('/health', (ctx) => {
  ctx.body = {
    data: {
      ok: true,
      service: 'shibi-api',
      time: new Date().toISOString()
    },
    requestId: ctx.state.requestId
  } satisfies ApiResponse<{ ok: boolean; service: string; time: string }>;
});
