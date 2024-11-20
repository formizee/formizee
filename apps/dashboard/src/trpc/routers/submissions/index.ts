import {router} from '@/trpc';

import {deleteSubmission} from './delete';
import {listSubmissions} from './list';

export const submissionsRouter = router({
  delete: deleteSubmission,
  list: listSubmissions
});
