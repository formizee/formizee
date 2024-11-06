import {newRoute} from '@/lib/hono';

import {registerPostWorkspace} from './post';
import {registerDeleteWorkspace} from './delete';

const workspaces = newRoute();

registerPostWorkspace(workspaces);
registerDeleteWorkspace(workspaces);

export {workspaces};
