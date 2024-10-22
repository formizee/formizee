import {router} from '@/trpc';
import {getUser} from './get';

export const userRouter = router({
  get: getUser
});
