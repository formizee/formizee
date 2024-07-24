import {authentication} from '@/lib/middlewares';
import {newRoute} from '@/lib/hono';

import {registerDeleteSubmission} from './delete';
import {registerListSubmissions} from './list';
import {registerPostSubmission} from './post';
import {registerGetSubmission} from './get';
import {registerPutSubmission} from './put';

const submissions = newRoute();
submissions.use(authentication());

registerGetSubmission(submissions);
registerPutSubmission(submissions);
registerPostSubmission(submissions);
registerDeleteSubmission(submissions);

const listSubmissions = newRoute();
listSubmissions.use(authentication());
registerListSubmissions(listSubmissions);

export {submissions, listSubmissions};
