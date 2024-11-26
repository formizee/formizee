import {newRoute} from '@/lib/hono';

import {registerGetSubmission} from './get';
import {registerPostSubmission} from './post';
import {registerDeleteSubmission} from './delete';

const submissions = newRoute();

registerGetSubmission(submissions);
registerPostSubmission(submissions);
registerDeleteSubmission(submissions);

export {submissions};
