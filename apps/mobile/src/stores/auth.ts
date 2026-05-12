import { defineStore } from 'pinia';
import type { UserProfile } from '@shibi/shared';
import { wechatLogin } from '../api/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string,
    user: null as UserProfile | null
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.token),
    isAdmin: (state) => state.user?.role === 'admin' || state.user?.role === 'curator'
  },
  actions: {
    restore() {
      this.token = (uni.getStorageSync('token') as string) || '';
      this.user = (uni.getStorageSync('user') as UserProfile) || null;
    },
    async login() {
      const loginResult = await uni.login();
      const result = await wechatLogin({ code: loginResult.code || `dev-${Date.now()}` });
      this.token = result.token;
      this.user = result.user;
      uni.setStorageSync('token', result.token);
      uni.setStorageSync('user', result.user);
    },
    logout() {
      this.token = '';
      this.user = null;
      uni.removeStorageSync('token');
      uni.removeStorageSync('user');
    }
  }
});
