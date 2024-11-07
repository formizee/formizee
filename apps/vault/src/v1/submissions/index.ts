import {pagination} from '@/lib/pagination';
import {newRoute} from '@/lib/hono';

import {registerGetSubmission} from './get';
import {registerPostSubmission} from './post';
import {registerListSubmissions} from './list';
import {registerDeleteSubmission} from './delete';

const submissions = newRoute();

registerGetSubmission(submissions);
registerPostSubmission(submissions);
registerDeleteSubmission(submissions);

const listSubmissions = newRoute();
listSubmissions.use(pagination());

registerListSubmissions(listSubmissions);

export {submissions, listSubmissions};
