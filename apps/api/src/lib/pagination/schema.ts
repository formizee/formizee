import {z} from '@hono/zod-openapi';

export const QuerySchema = z.object({
  page: z.coerce.number().min(1).default(1).openapi('PageNumber'),
  limit: z.coerce.number().min(1).default(100).openapi('Limit')
});

export const MetadataSchema = z.object({
  page: z.number().min(1).default(1).openapi('CurrentPageNumber'),
  totalPages: z.number().min(1).openapi('TotalPages'),
  itemsPerPage: z.number().min(1).max(256).default(100).openapi('TotalItems')
});
