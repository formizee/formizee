import {newRoute} from '@/lib/hono';

import {registerPostSubmission} from './post';

const submissions = newRoute();

registerPostSubmission(submissions);

export {submissions};
