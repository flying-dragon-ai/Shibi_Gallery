import type { UserProfile } from '@shibi/shared';
import { request } from './request';

export interface LoginResult {
  token: string;
  user: UserProfile;
}

export function wechatLogin(input: { code: string; nickname?: string; avatarUrl?: string }) {
  return request<LoginResult>('/auth/wechat-login', { method: 'POST', body: input });
}
