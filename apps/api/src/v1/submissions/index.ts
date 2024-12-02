import {authentication, parseBody} from '@/lib/middlewares';
import {pagination} from '@/lib/pagination';
import {newRoute} from '@/lib/hono';

import {registerDeleteSubmission} from './delete';
import {registerListSubmissions} from './list';
import {registerPostSubmission} from './post';
import {registerGetSubmission} from './get';
import {registerPutSubmission} from './put';

const publicRoute = newRoute();
publicRoute.use(parseBody);

registerPostSubmission(publicRoute);

const protectedRoute = newRoute();
protectedRoute.use(authentication());

registerGetSubmission(protectedRoute);
registerPutSubmission(protectedRoute);
registerDeleteSubmission(protectedRoute);

const protectedListRote = newRoute();
protectedListRote.use(authentication());
protectedListRote.use(pagination());
registerListSubmissions(protectedListRote);

export {
  publicRoute as postSubmission,
  protectedRoute as submissions,
  protectedListRote as listSubmissions
};
