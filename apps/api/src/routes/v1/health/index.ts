import {OpenAPIHono} from '@hono/zod-openapi';

import {handleZodError} from '@/lib/errors';
import {registerGetStatus} from './get';

const healthAPI = new OpenAPIHono({
  defaultHook: handleZodError
});

registerGetStatus(healthAPI);

export {healthAPI};
