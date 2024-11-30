import {authentication} from '@/lib/middlewares/auth';
import {pagination} from '@/lib/pagination';
import {newRoute} from '@/lib/hono';

import {registerGetSubmission} from './get';
import {registerPutSubmission} from './put';
import {registerPostSubmission} from './post';
import {registerListSubmissions} from './list';
import {registerDeleteSubmission} from './delete';

const submissions = newRoute();
const listSubmissions = newRoute();

submissions.use(authentication());
registerGetSubmission(submissions);
registerPutSubmission(submissions);
registerPostSubmission(submissions);
registerDeleteSubmission(submissions);

listSubmissions.use(authentication());
listSubmissions.use(pagination());
registerListSubmissions(listSubmissions);

export {submissions, listSubmissions};
