import Router from '@koa/router';
import { updateOrderStatusSchema } from '@shibi/shared';
import { z } from 'zod';
import { authJwt, requireRole } from '../../middlewares/auth.js';
import { validateBody, validateParams } from '../../middlewares/validate.js';
import { updateOrderStatus } from '../orders/order.service.js';
import {
  createArtist,
  createArtwork,
  createCuration,
  updateArtist,
  updateArtwork,
  updateCuration
} from './admin.service.js';

export const adminRouter = new Router({ prefix: '/api/admin' });
const adminOnly = [authJwt, requireRole(['admin', 'curator'])];
const entityParams = z.object({ id: z.string().uuid() });

adminRouter.post('/artists', ...adminOnly, async (ctx) => {
  ctx.status = 201;
  ctx.body = { data: await createArtist(ctx.request.body), requestId: ctx.state.requestId };
});

adminRouter.patch('/artists/:id', ...adminOnly, validateParams(entityParams), async (ctx) => {
  ctx.body = { data: await updateArtist(ctx.params.id, ctx.request.body), requestId: ctx.state.requestId };
});

adminRouter.post('/artists/:id', ...adminOnly, validateParams(entityParams), async (ctx) => {
  ctx.body = { data: await updateArtist(ctx.params.id, ctx.request.body), requestId: ctx.state.requestId };
});

adminRouter.post('/artworks', ...adminOnly, async (ctx) => {
  ctx.status = 201;
  ctx.body = { data: await createArtwork(ctx.request.body), requestId: ctx.state.requestId };
});

adminRouter.patch('/artworks/:id', ...adminOnly, validateParams(entityParams), async (ctx) => {
  ctx.body = { data: await updateArtwork(ctx.params.id, ctx.request.body), requestId: ctx.state.requestId };
});

adminRouter.post('/artworks/:id', ...adminOnly, validateParams(entityParams), async (ctx) => {
  ctx.body = { data: await updateArtwork(ctx.params.id, ctx.request.body), requestId: ctx.state.requestId };
});

adminRouter.post('/curations', ...adminOnly, async (ctx) => {
  ctx.status = 201;
  ctx.body = { data: await createCuration(ctx.request.body), requestId: ctx.state.requestId };
});

adminRouter.patch('/curations/:id', ...adminOnly, validateParams(entityParams), async (ctx) => {
  ctx.body = { data: await updateCuration(ctx.params.id, ctx.request.body), requestId: ctx.state.requestId };
});

adminRouter.post('/curations/:id', ...adminOnly, validateParams(entityParams), async (ctx) => {
  ctx.body = { data: await updateCuration(ctx.params.id, ctx.request.body), requestId: ctx.state.requestId };
});

adminRouter.patch(
  '/orders/:id/status',
  ...adminOnly,
  validateParams(entityParams),
  validateBody(updateOrderStatusSchema),
  async (ctx) => {
    const body = ctx.request.body as z.infer<typeof updateOrderStatusSchema>;
    ctx.body = { data: await updateOrderStatus(ctx.params.id, body.status), requestId: ctx.state.requestId };
  }
);

adminRouter.post(
  '/orders/:id/status',
  ...adminOnly,
  validateParams(entityParams),
  validateBody(updateOrderStatusSchema),
  async (ctx) => {
    const body = ctx.request.body as z.infer<typeof updateOrderStatusSchema>;
    ctx.body = { data: await updateOrderStatus(ctx.params.id, body.status), requestId: ctx.state.requestId };
  }
);
