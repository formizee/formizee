import {newRoute} from '@/lib/hono';

import {registerGetSubmission} from './get';
import {registerPutSubmission} from './put';
import {registerPostSubmission} from './post';
import {registerDeleteSubmission} from './delete';

const submissions = newRoute();

registerGetSubmission(submissions);
registerPutSubmission(submissions);
registerPostSubmission(submissions);
registerDeleteSubmission(submissions);

export {submissions};
