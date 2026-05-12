import type { UserProfile } from '@shibi/shared';
import { query } from '../../db/pool.js';
import { signAccessToken } from '../../middlewares/auth.js';
import { env } from '../../config/env.js';

interface UserRow {
  id: string;
  openid: string;
  nickname: string | null;
  avatar_url: string | null;
  role: UserProfile['role'];
}

async function resolveOpenid(code: string): Promise<string> {
  if (env.MOCK_WECHAT_LOGIN || !env.WECHAT_APP_ID || !env.WECHAT_APP_SECRET) {
    return `mock-${code}`;
  }

  const url = new URL('https://api.weixin.qq.com/sns/jscode2session');
  url.searchParams.set('appid', env.WECHAT_APP_ID);
  url.searchParams.set('secret', env.WECHAT_APP_SECRET);
  url.searchParams.set('js_code', code);
  url.searchParams.set('grant_type', 'authorization_code');

  const response = await fetch(url);
  const payload = (await response.json()) as { openid?: string; errcode?: number; errmsg?: string };
  if (!payload.openid) {
    throw Object.assign(new Error(payload.errmsg ?? '微信登录失败'), { status: 401, expose: true });
  }
  return payload.openid;
}

export async function loginWithWechat(input: { code: string; nickname?: string; avatarUrl?: string }) {
  const openid = await resolveOpenid(input.code);
  const rows = await query<UserRow>(
    `INSERT INTO users (openid, nickname, avatar_url)
     VALUES ($1, $2, $3)
     ON CONFLICT (openid)
     DO UPDATE SET nickname = COALESCE(EXCLUDED.nickname, users.nickname),
                   avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
                   updated_at = now()
     RETURNING id, openid, nickname, avatar_url, role`,
    [openid, input.nickname ?? null, input.avatarUrl ?? null]
  );

  const user = rows[0];
  const profile: UserProfile = {
    id: user.id,
    nickname: user.nickname,
    avatarUrl: user.avatar_url,
    role: user.role
  };

  return {
    token: signAccessToken({ id: user.id, role: user.role, openid: user.openid }),
    user: profile
  };
}
