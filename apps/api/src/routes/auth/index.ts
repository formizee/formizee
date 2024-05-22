import {AuthLogin, AuthRegister} from '@/useCases/auth';
import {StatusCode} from 'hono/utils/http-status';
import {Hono} from 'hono';

import {createSession, deleteSession} from '@/lib/auth';
import {loginSchema, registerSchema} from './schema';
/* @ts-ignore-next-line */
import {zValidator} from '@hono/zod-validator';

const authRouter = new Hono();

authRouter.get('/status', async context => {
  return context.json('OK', 200);
});

authRouter.post('/login', zValidator('json', loginSchema), async context => {
  const {email, password} = context.req.valid('json');

  const service = new AuthLogin(email, password);
  const user = await service.run();

  if (!user.ok) return context.json(user.body, user.status as StatusCode);

  await createSession(context, user.body.uid);

  return context.json(user.body, 201);
});

authRouter.post(
  '/register',
  zValidator('json', registerSchema),
  async context => {
    const {name, email, password} = context.req.valid('json');

    const service = new AuthRegister(name, email, password);
    const user = await service.run();

    if (!user.ok) return context.json(user.body, user.status as StatusCode);

    await createSession(context, user.body.uid);

    return context.json(user.body, 201);
  }
);

authRouter.post('/logout', async context => {
  await deleteSession(context);
  return context.json('OK', 200);
});

export default authRouter;
