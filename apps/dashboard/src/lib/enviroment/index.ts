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

      // Databases
      DATABASE_URL: z
        .string()
        .url()
        .default('postgresql://formizee:password@localhost/formizee'),

      // Analytics
      TINYBIRD_URL: z.string().url().optional(),
      TINYBIRD_TOKEN: z.string().optional(),

      // Communications
      RESEND_TOKEN: z.string().optional()
    })
    .parse(process.env);
