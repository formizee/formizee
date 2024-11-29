import {pagination} from '@/lib/pagination';
import {newRoute} from '@/lib/hono';

import {registerGetSubmission} from './get';
import {registerPutSubmission} from './put';
import {registerPostSubmission} from './post';
import {registerDeleteSubmission} from './delete';
import {registerListSubmissions} from './list';

const submissions = newRoute();
const listSubmissions = newRoute();

registerGetSubmission(submissions);
registerPutSubmission(submissions);
registerPostSubmission(submissions);
registerDeleteSubmission(submissions);

listSubmissions.use(pagination());
registerListSubmissions(listSubmissions);

export {submissions, listSubmissions};
