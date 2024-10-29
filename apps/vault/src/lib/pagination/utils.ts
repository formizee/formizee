import {HTTPException} from 'hono/http-exception';

export const calculateTotalPages = (
  page: number,
  totalItems: number,
  limit: number
): number => {
  const totalPages = Math.ceil(totalItems / limit);

  if (page > totalPages) {
    throw new HTTPException(404, {
      message: `The requested page ${page} does not exist. There are only ${totalPages} pages available`
    });
  }

  return totalPages;
};
