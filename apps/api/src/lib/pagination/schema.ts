import {z} from '@hono/zod-openapi';

export const QuerySchema = z.object({
  page: z.coerce.number().min(1).default(1).openapi('Page number'),
  limit: z.coerce
    .number()
    .min(1)
    .default(100)
    .openapi('Number of items per page')
});

export const MetadataSchema = z.object({
  page: z.number().min(1).default(1).openapi('Current page number'),
  totalPages: z.number().min(1).openapi('The total pages for this request'),
  itemsPerPage: z
    .number()
    .min(1)
    .max(256)
    .default(100)
    .openapi('The number of items per page')
});
