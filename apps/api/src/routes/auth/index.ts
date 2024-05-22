import {AuthLogin, AuthRegister, AuthSendVerification, AuthVerifyUser} from '@/useCases/auth';
import {StatusCode} from 'hono/utils/http-status';
import {Hono} from 'hono';

import {createSession, deleteSession} from '@/lib/auth';
import {loginSchema, registerSchema, sendVerificationSchema, verifyTokenSchema} from './schema';
/* @ts-ignore-next-line */
import {zValidator} from '@hono/zod-validator';
import { AuthResetPassword } from '@/useCases/auth/reset-password';

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

authRouter.post('/send-verification', zValidator('json', sendVerificationSchema), async context => {
  const {email} = context.req.valid('json');
  
  const service = new AuthSendVerification(email);
  const response = await service.run();

  return context.json(response.body, response.status as StatusCode);
})

authRouter.post('/verify-account', zValidator('json', verifyTokenSchema), async context => {
  const {email, token} = context.req.valid('json');
  
  const service = new AuthVerifyUser(email, token);
  const user = await service.run();

  return context.json(user.body, user.status as StatusCode);
})

authRouter.post('/reset-password', zValidator('json', verifyTokenSchema), async context => {
  const {email, token} = context.req.valid('json');
  
  const service = new AuthResetPassword(email, token);
  const user = await service.run();

  if (!user.ok) return context.json(user.body, user.status as StatusCode);

  await createSession(context, user.body.uid);

  return context.json(user.body, user.status as StatusCode);
})

authRouter.post('/logout', async context => {
  await deleteSession(context);
  return context.json('OK', 200);
});

export default authRouter;
