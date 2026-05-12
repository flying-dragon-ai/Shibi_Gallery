import Router from '@koa/router';
import { authJwt, requireRole } from '../../middlewares/auth.js';
import { getDashboardStats } from './analytics.service.js';

export const analyticsRouter = new Router({ prefix: '/api/admin/analytics' });

analyticsRouter.get('/dashboard', authJwt, requireRole(['admin', 'curator']), async (ctx) => {
  ctx.body = { data: await getDashboardStats(), requestId: ctx.state.requestId };
});
