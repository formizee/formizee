import {router} from '@/trpc';

// Procedures
import {deleteLinkedEmail} from './delete-email';
import {addLinkedEmail} from './add-email';
import {updateUserName} from './update-name';
import {updateUserSlug} from './update-slug';
import {getUserEmails} from './get-emails';
import {getUser} from './get';

export const userRouter = router({
  deleteLinkedEmail: deleteLinkedEmail,
  addLinkedEmail: addLinkedEmail,
  updateName: updateUserName,
  updateSlug: updateUserSlug,
  getEmails: getUserEmails,
  get: getUser
});
