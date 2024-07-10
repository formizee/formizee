import type { Context } from 'hono';
import {bodyLimit as honoBodyLimit} from 'hono/body-limit';

export const bodyLimit = honoBodyLimit({
  maxSize: 50 * 1024,
  onError: (context: Context) => {
    return context.text('The max size of the body is 50Kb.', 413)
  },
})
