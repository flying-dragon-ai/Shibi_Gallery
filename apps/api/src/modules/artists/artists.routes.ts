import Router from '@koa/router';
import { z } from 'zod';
import { validateParams } from '../../middlewares/validate.js';
import { getArtist, listArtists } from './artists.service.js';

const idParams = z.object({ id: z.string().uuid() });
export const artistsRouter = new Router({ prefix: '/api/artists' });

artistsRouter.get('/', async (ctx) => {
  ctx.body = { data: await listArtists(), requestId: ctx.state.requestId };
});

artistsRouter.get('/:id', validateParams(idParams), async (ctx) => {
  ctx.body = { data: await getArtist(ctx.params.id), requestId: ctx.state.requestId };
});
