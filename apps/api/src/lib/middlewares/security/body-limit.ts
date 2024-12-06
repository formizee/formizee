import {bodyLimit as honoBodyLimit} from 'hono/body-limit';
import {HTTPException} from 'hono/http-exception';

export const bodyLimit = honoBodyLimit({
  maxSize: 50 * 50 * 1024,
  onError: () => {
    throw new HTTPException(413, {
      message: 'The max size of the submission is 50Mb.'
    });
  }
});
