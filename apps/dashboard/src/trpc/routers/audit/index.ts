import {router} from '@/trpc';

import {listLogs} from './list';

export const auditRouter = router({
  list: listLogs
});
