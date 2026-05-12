import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().default('postgres://postgres:postgres@localhost:5432/shibi_gallery'),
  JWT_SECRET: z.string().min(16).default('local-development-secret-change-me'),
  JWT_EXPIRES_IN: z.union([z.literal('1h'), z.literal('12h'), z.literal('1d'), z.literal('7d'), z.literal('30d')]).default('7d'),
  WECHAT_APP_ID: z.string().optional(),
  WECHAT_APP_SECRET: z.string().optional(),
  MOCK_WECHAT_LOGIN: z.coerce.boolean().default(true),
  CORS_ORIGIN: z.string().default('*')
});

export const env = envSchema.parse(process.env);
