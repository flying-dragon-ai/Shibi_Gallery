import type { Middleware } from 'koa';
import jwt from 'jsonwebtoken';
import type { UserRole } from '@shibi/shared';
import { env } from '../config/env.js';

export interface AuthUser {
  id: string;
  role: UserRole;
  openid: string;
}

export function signAccessToken(user: AuthUser): string {
  return jwt.sign({ sub: user.id, role: user.role, openid: user.openid }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
}

export const authJwt: Middleware = async (ctx, next) => {
  const header = ctx.get('authorization');
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) ctx.throw(401, '请先登录');

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    ctx.state.user = {
      id: String(payload.sub),
      role: payload.role as UserRole,
      openid: String(payload.openid)
    } satisfies AuthUser;
    await next();
  } catch {
    ctx.throw(401, '登录已过期');
  }
};

export function requireRole(roles: UserRole[]): Middleware {
  return async (ctx, next) => {
    const user = ctx.state.user as AuthUser | undefined;
    if (!user || !roles.includes(user.role)) ctx.throw(403, '没有权限访问该资源');
    await next();
  };
}
