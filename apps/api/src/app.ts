import Koa from 'koa';
import type { Middleware } from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import koaHelmet from 'koa-helmet';
import { env } from './config/env.js';
import { requestId } from './middlewares/request-id.js';
import { errorHandler } from './middlewares/error-handler.js';
import { logger, requestLogger } from './middlewares/logger.js';
import { healthRouter } from './routes/health.routes.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { artistsRouter } from './modules/artists/artists.routes.js';
import { artworksRouter } from './modules/artworks/artworks.routes.js';
import { curationsRouter } from './modules/curations/curations.routes.js';
import { favoritesRouter } from './modules/favorites/favorites.routes.js';
import { ordersRouter } from './modules/orders/orders.routes.js';
import { adminRouter } from './modules/admin/admin.routes.js';
import { analyticsRouter } from './modules/analytics/analytics.routes.js';

export function createApp() {
  const app = new Koa();

  app.use(requestId);
  app.use(errorHandler);
  app.use(requestLogger);
  const secureHeaders = koaHelmet as unknown as () => Middleware;
  app.use(secureHeaders());
  app.use(cors({ origin: env.CORS_ORIGIN === '*' ? '*' : env.CORS_ORIGIN }));
  app.use(bodyParser());

  const routers = [
    healthRouter,
    authRouter,
    artistsRouter,
    artworksRouter,
    curationsRouter,
    favoritesRouter,
    ordersRouter,
    adminRouter,
    analyticsRouter
  ];

  for (const router of routers) {
    app.use(router.routes());
    app.use(router.allowedMethods());
  }

  app.on('error', (error, ctx) => {
    logger.error({ error, requestId: ctx?.state?.requestId }, 'request failed');
  });

  return app;
}
