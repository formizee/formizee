import {supportedContentTypes, validateContentType} from './utils';
import {HTTPException} from 'hono/http-exception';
import type {Context, Next} from 'hono';
import type {HonoEnv} from '@/lib/hono';

interface BodyData {
  data: Record<string, string>;
  fileUploads: {field: string; file: File}[];
}
const parseBody = async (context: Context<HonoEnv>, next: Next) => {
  const {logger} = context.get('services');

  const {contentType, valid} = validateContentType(
    context.req.header('Content-Type')
  );

  if (!valid) {
    throw new HTTPException(415, {
      message: `Use one of the supported body types: ${supportedContentTypes}`
    });
  }

  let bodyData: BodyData = {
    data: {},
    fileUploads: []
  };

  if (contentType === 'application/json') {
    try {
      const input =
        await context.req.json<
          Record<string, string | number | boolean | null>
        >();
      const data: Record<string, string> = {};

      Object.entries(input).map(([key, value]) => {
        if (value === null) {
          data[key] = '';
        } else if (typeof value !== 'string') {
          data[key] = String(value);
        } else {
          data[key] = value;
        }
      });

      bodyData = {data, fileUploads: []};
    } catch (error) {
      logger.error('Error parsing json body', {error});
      throw new HTTPException(400, {
        message: 'Invalid JSON body'
      });
    }
  }

  if (contentType === 'multipart/form-data') {
    try {
      const formData = await context.req.parseBody();
      const fileUploads: {field: string; file: File}[] = [];
      const data: Record<string, string> = {};

      for (const [key, value] of Object.entries(formData)) {
        if (value instanceof File) {
          fileUploads.push({
            field: key,
            file: value
          });
        } else {
          data[key] = value;
        }
      }
      bodyData = {data, fileUploads};
    } catch (error) {
      console.error(error);
      logger.error('Invalid multipart form', {error});
      throw new HTTPException(400, {
        message: 'Invalid multipart form'
      });
    }
  }

  if (contentType === 'application/x-www-form-urlencoded') {
    try {
      const formData = await context.req.parseBody();
      const data: Record<string, string> = {};

      for (const [key, value] of Object.entries(formData)) {
        if (typeof value === 'string') {
          data[key] = value;
        }
      }
      bodyData = {data, fileUploads: []};
    } catch (error) {
      logger.error('Invalid urlencoded form', {error});
      throw new HTTPException(400, {
        message: 'Invalid form data'
      });
    }
  }
  context.set('body', bodyData);
  await next();
};

export {parseBody};
