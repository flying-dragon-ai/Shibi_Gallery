import Router from '@koa/router';
import { z } from 'zod';
import { validateParams } from '../../middlewares/validate.js';
import { getArtwork, listArtworks } from './artworks.service.js';
import { recordEvent } from '../analytics/analytics.service.js';

const idParams = z.object({ id: z.string().uuid() });
export const artworksRouter = new Router({ prefix: '/api/artworks' });

artworksRouter.get('/', async (ctx) => {
  ctx.body = { data: await listArtworks(), requestId: ctx.state.requestId };
});

artworksRouter.get('/:id', validateParams(idParams), async (ctx) => {
  const artwork = await getArtwork(ctx.params.id);
  await recordEvent({ userId: ctx.state.user?.id, eventType: 'view', targetType: 'artwork', targetId: artwork.id });
  ctx.body = { data: artwork, requestId: ctx.state.requestId };
});
