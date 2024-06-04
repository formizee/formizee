import {type StatusCode} from 'hono/utils/http-status';
import {Hono} from 'hono';
/* @ts-expect-error-next-line */
import {zValidator} from '@hono/zod-validator';
import type {Response, User} from 'domain/models';
import {createSession, deleteSession} from '@/lib/auth';
import {
  AuthLogin,
  AuthRegister,
  AuthSendVerification,
  AuthVerifyUser,
  AuthResetPassword
} from '@/useCases/auth';
import {
  createVerification,
  deleteVerification,
  readVerification
} from '@/lib/auth/verification';
import {
  loginSchema,
  registerSchema,
  sendVerificationSchema,
  verifyTokenSchema
} from './schema';

const auth = new Hono();

auth.post('/login', zValidator('json', loginSchema), async context => {
  const {email, password} = context.req.valid('json');

  const service = new AuthLogin(email, password);
  const user = await service.run();

  if (!user.ok) return context.json(user.body, user.status as StatusCode);
  const {uid, name, permission, isVerified} = user.body;

  if (isVerified) {
    await createSession(context, {uid, name, permission});
    return context.json(user.body, 200);
  }
  const verificationService = new AuthSendVerification(email);
  await verificationService.run();

  await createVerification(context, email, 'account');
  return context.json({error: 'Please verify the user before login.'}, 403);
});

auth.post('/register', zValidator('json', registerSchema), async context => {
  const {name, email, password} = context.req.valid('json');

  const service = new AuthRegister(name, email, password);
  const user = await service.run();

  if (!user.ok) return context.json(user.body, user.status as StatusCode);

  const verificationService = new AuthSendVerification(email);
  await verificationService.run();

  await createVerification(context, email, 'account');

  return context.json('OK', 201);
});

auth.post(
  '/send-verification',
  zValidator('json', sendVerificationSchema),
  async context => {
    const {email, type} = context.req.valid('json');

    const service = new AuthSendVerification(email);
    const response = await service.run();

    await createVerification(context, email, type);

    return context.json(response.body, response.status as StatusCode);
  }
);

auth.post('/verify', zValidator('json', verifyTokenSchema), async context => {
  const {isValid, email, type} = await readVerification(context);
  const {token} = context.req.valid('json');

  if (!isValid || !email) {
    return context.json(
      {error: 'The email for validation has not been specified.'},
      400
    );
  }

  let user: Response<User>;

  if (type === 'account') {
    const service = new AuthVerifyUser(email, token);
    user = await service.run();
  } else {
    const service = new AuthResetPassword(email, token);
    user = await service.run();
  }

  if (!user.ok) return context.json(user.body, user.status as StatusCode);

  await createSession(context, {
    uid: user.body.uid,
    name: user.body.name,
    permission: user.body.permission
  });
  deleteVerification(context);

  return context.json({user: user.body, type}, user.status as StatusCode);
});

auth.post('/logout', context => {
  deleteSession(context);
  return context.json('OK', 200);
});

export default auth;
