import Router from '@koa/router';
import { createOrderSchema } from '@shibi/shared';
import { z } from 'zod';
import { authJwt } from '../../middlewares/auth.js';
import { validateBody, validateParams } from '../../middlewares/validate.js';
import { createOrder, getOrderForUser, listMyOrders } from './order.service.js';

const orderParams = z.object({ id: z.string().uuid() });
export const ordersRouter = new Router({ prefix: '/api/orders' });

ordersRouter.post('/', authJwt, validateBody(createOrderSchema), async (ctx) => {
  const body = ctx.request.body as z.infer<typeof createOrderSchema>;
  const order = await createOrder({ userId: ctx.state.user.id, ...body });
  ctx.status = 201;
  ctx.body = { data: order, requestId: ctx.state.requestId };
});

ordersRouter.get('/me', authJwt, async (ctx) => {
  ctx.body = { data: await listMyOrders(ctx.state.user.id), requestId: ctx.state.requestId };
});

ordersRouter.get('/:id', authJwt, validateParams(orderParams), async (ctx) => {
  ctx.body = { data: await getOrderForUser(ctx.params.id, ctx.state.user.id), requestId: ctx.state.requestId };
});
