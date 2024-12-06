import {bodyLimit as honoBodyLimit} from 'hono/body-limit';
import {HTTPException} from 'hono/http-exception';

export const bodyLimit = honoBodyLimit({
  maxSize: 100 * 1024 * 1024,
  onError: () => {
    throw new HTTPException(413, {
      message: 'The max size of the body is 100Mb.'
    });
  }
});
