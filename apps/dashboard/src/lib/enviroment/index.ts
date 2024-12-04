import {z} from 'zod';

export const env = () =>
  z
    .object({
      // General
      VERCEL_ENV: z
        .enum(['development', 'preview', 'production'])
        .optional()
        .default('development'),
      VERCEL_URL: z.string().optional(),
      DASHBOARD_URL: z.string().default('http://localhost:3002'),
      VAULT_URL: z.string().default('http://localhost:8888'),

      // Databases
      DATABASE_URL: z.string().url().default('http://localhost:8080'),
      DATABASE_AUTH_TOKEN: z.string().default(''),

      // Storage
      VAULT_SECRET: z.string().default(''),

      // Billing
      LEMONSQUEEZY_API_KEY: z.string().default(''),
      LEMONSQUEEZY_STORE_ID: z.string().default(''),
      LEMONSQUEEZY_WEBHOOK_SECRET: z.string().default(''),

      // Analytics
      TINYBIRD_URL: z.string().url().optional(),
      TINYBIRD_TOKEN: z.string().optional(),

      // Communications
      RESEND_TOKEN: z.string().default('re_123456789'),

      // Authentication
      AUTH_SECRET: z.string().default('')
    })
    .parse(process.env);
