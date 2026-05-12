import Router from '@koa/router';
import { wechatLoginSchema } from '@shibi/shared';
import { validateBody } from '../../middlewares/validate.js';
import { loginWithWechat } from './auth.service.js';

export const authRouter = new Router({ prefix: '/api/auth' });

authRouter.post('/wechat-login', validateBody(wechatLoginSchema), async (ctx) => {
  const result = await loginWithWechat(ctx.request.body as { code: string; nickname?: string; avatarUrl?: string });
  ctx.body = { data: result, requestId: ctx.state.requestId };
});
