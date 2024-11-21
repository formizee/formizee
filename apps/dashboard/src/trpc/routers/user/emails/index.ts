import {router} from '@/trpc';

// Procedures
import {deleteLinkedEmail} from './delete';
import {addLinkedEmail} from './create';
import {getUserEmails} from './get';

export const emailsUserRouter = router({
  delete: deleteLinkedEmail,
  create: addLinkedEmail,
  get: getUserEmails
});

export default emailsUserRouter;
