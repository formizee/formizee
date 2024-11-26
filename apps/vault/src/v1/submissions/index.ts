import {newRoute} from '@/lib/hono';

import {registerGetSubmission} from './get';
import {registerPostSubmission} from './post';

const submissions = newRoute();

registerGetSubmission(submissions);
registerPostSubmission(submissions);

export {submissions};
