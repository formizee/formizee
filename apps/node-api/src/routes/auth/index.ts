import type {StatusCode} from 'hono/utils/http-status';
import {zValidator} from '@hono/zod-validator';
import {Hono} from 'hono';
import {
  LoginAuth,
  RegisterAuth,
  SendVerificationAuth,
  VerifyAuth
} from '@/useCases/auth';
import {
  createSession,
  createVerification,
  deleteSession,
  deleteVerification,
  verifyVerification
} from '@/lib/auth';
import {Login, Register, Verify, SendVerification} from './schemas';

export const auth = new Hono();

auth.post('/login', zValidator('json', Login), async context => {
  const {email, password} = context.req.valid('json');

  const service = new LoginAuth(email, password);
  const user = await service.run();

  if (!user.ok) return context.json(user.body, user.status as StatusCode);
  const {uid, name, permission, isVerified} = user.body;

  if (isVerified) {
    await createSession(context, {uid, name, permission});
    return context.json(user.body, 200);
  }
  const verificationService = new SendVerificationAuth(email);
  await verificationService.run();

  await createVerification(context, {email, type: 'account'});
  return context.json({error: 'Please verify the user before login.'}, 403);
});

auth.post('/register', zValidator('json', Register), async context => {
  const {name, email, password} = context.req.valid('json');

  const service = new RegisterAuth(name, email, password);
  const user = await service.run();

  if (!user.ok) {
    return context.json(user.body, user.status as StatusCode);
  }

  const verificationService = new SendVerificationAuth(email);
  await verificationService.run();

  await createVerification(context, {email, type: 'account'});

  return context.text('OK', 201);
});

auth.post('/verify', zValidator('json', Verify), async context => {
  const {isValid, data} = await verifyVerification(context);
  const {token} = context.req.valid('json');

  if (!isValid || !data) {
    return context.json(
      {error: 'The validation failed, please try again.'},
      400
    );
  }

  const service = new VerifyAuth(data.email, token);
  const user = await service.run();

  if (!user.ok) {
    return context.json(user.body, user.status as StatusCode);
  }

  await createSession(context, {
    uid: user.body.uid,
    name: user.body.name,
    permission: user.body.permission
  });

  deleteVerification(context);

  return context.json(
    {user: user.body, type: data.type},
    user.status as StatusCode
  );
});

auth.post(
  '/send-verification',
  zValidator('json', SendVerification),
  async context => {
    const {email, type} = context.req.valid('json');

    const service = new SendVerificationAuth(email);
    const response = await service.run();

    await createVerification(context, {email, type});

    return context.json(response.body, response.status as StatusCode);
  }
);

auth.post('/logout', context => {
  deleteSession(context);
  return context.json('OK', 200);
});

export default auth;
