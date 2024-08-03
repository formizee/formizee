import {auth, publicProcedure, router} from '../server';
import {database} from '@/lib/db';

export const appRouter = router({
  getUsers: publicProcedure.use(auth).query(async () => {
    return await database.query.user.findMany();
  })
});

export type AppRouter = typeof appRouter;
