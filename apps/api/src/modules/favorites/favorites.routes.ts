import Router from '@koa/router';
import { z } from 'zod';
import { authJwt } from '../../middlewares/auth.js';
import { validateParams } from '../../middlewares/validate.js';
import { addFavorite, listFavorites, removeFavorite } from './favorites.service.js';

const artworkParams = z.object({ artworkId: z.string().uuid() });
export const favoritesRouter = new Router({ prefix: '/api/favorites' });

favoritesRouter.get('/me', authJwt, async (ctx) => {
  ctx.body = { data: await listFavorites(ctx.state.user.id), requestId: ctx.state.requestId };
});

favoritesRouter.post('/:artworkId', authJwt, validateParams(artworkParams), async (ctx) => {
  await addFavorite(ctx.state.user.id, ctx.params.artworkId);
  ctx.status = 201;
  ctx.body = { data: { ok: true }, requestId: ctx.state.requestId };
});

favoritesRouter.delete('/:artworkId', authJwt, validateParams(artworkParams), async (ctx) => {
  await removeFavorite(ctx.state.user.id, ctx.params.artworkId);
  ctx.body = { data: { ok: true }, requestId: ctx.state.requestId };
});
