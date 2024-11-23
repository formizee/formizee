import {router} from '@/trpc';

import {deleteSubmissionGroup} from './delete-group';
import {deleteSubmission} from './delete';
import {listSubmissions} from './list';

export const submissionsRouter = router({
  deleteGroup: deleteSubmissionGroup,
  delete: deleteSubmission,
  list: listSubmissions
});
