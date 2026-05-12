import { describe, expect, it } from 'vitest';
import { signAccessToken } from '../src/middlewares/auth.js';

describe('auth token', () => {
  it('signs a JWT for a user', () => {
    const token = signAccessToken({ id: '00000000-0000-0000-0000-000000000001', role: 'admin', openid: 'mock-admin' });
    expect(token.split('.')).toHaveLength(3);
  });
});
