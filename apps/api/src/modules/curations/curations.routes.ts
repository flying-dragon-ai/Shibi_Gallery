import Router from '@koa/router';
import { z } from 'zod';
import { validateParams } from '../../middlewares/validate.js';
import { getCuration, listCurations } from './curations.service.js';

const idParams = z.object({ id: z.string().uuid() });
export const curationsRouter = new Router({ prefix: '/api/curations' });

curationsRouter.get('/', async (ctx) => {
  ctx.body = { data: await listCurations(), requestId: ctx.state.requestId };
});

curationsRouter.get('/:id', validateParams(idParams), async (ctx) => {
  ctx.body = { data: await getCuration(ctx.params.id), requestId: ctx.state.requestId };
});
