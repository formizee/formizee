import {OpenAPIHono} from '@hono/zod-openapi';
import {handleValidationErrors} from '@/lib/openapi';
import {userResponse} from '@/lib/models';
import {
  authentication,
  createSession,
  createVerification,
  deleteSession,
  deleteVerification,
  verifyVerification
} from '@/lib/auth';
import {
  LoginAuth,
  RegisterAuth,
  VerifyLinkedEmail,
  SendLinkedEmailVerificationAuth,
  SendVerificationAuth,
  VerifyAuth
} from '@/useCases/auth';
import {
  postLinkedEmailsSendVerificationRoute,
  postLinkedEmailsVerifyRoute,
  postLoginRoute,
  postLogoutRoute,
  postRegisterRoute,
  postSendVerificationRoute,
  postVerifyRoute
} from './routes';

export const auth = new OpenAPIHono({
  defaultHook: (result, context) => {
    if (!result.success) {
      const error = handleValidationErrors(result.error);
      return context.json(error, 400);
    }
  }
});

auth.openapi(postLoginRoute, async context => {
  const {email, password} = context.req.valid('json');

  const service = new LoginAuth(email, password);
  const user = await service.run();

  if (user.status === 401) return context.json(user.error, user.status);
  const {id, isVerified} = user.body;

  if (isVerified) {
    await createSession(context, {id});
    return context.json(userResponse(user.body), 200);
  }
  const verificationService = new SendVerificationAuth(email);
  await verificationService.run();

  await createVerification(context, {email, type: 'account'});
  return context.json(
    {
      name: 'Verification Needed',
      description: 'Please verify the user before login.'
    },
    403
  );
});

auth.openapi(postRegisterRoute, async context => {
  const {name, email, password} = context.req.valid('json');

  const service = new RegisterAuth(name, email, password);
  const user = await service.run();

  if (user.status === 409) {
    return context.json(user.error, user.status);
  }

  const verificationService = new SendVerificationAuth(email);
  await verificationService.run();

  await createVerification(context, {email, type: 'account'});

  return context.text('Account created successfully.', 201);
});

auth.openapi(postVerifyRoute, async context => {
  const {isValid, data} = await verifyVerification(context);
  const {token} = context.req.valid('json');

  if (!isValid || !data) {
    return context.json(
      {
        name: 'Bad request',
        description: 'The validation failed, please try again.'
      },
      400
    );
  }

  const service = new VerifyAuth(data.email, token);
  const user = await service.run();

  if (user.status === 401 || user.status === 404) {
    return context.json(user.error, user.status);
  }

  await createSession(context, { id: user.body.id });

  deleteVerification(context);

  return context.json({user: userResponse(user.body), type: data.type}, 200);
});

auth.openapi(postSendVerificationRoute, async context => {
  const {email, type} = context.req.valid('json');

  const service = new SendVerificationAuth(email);
  const response = await service.run();

  if (response.status === 404) {
    return context.json(response.error, response.status);
  }

  await createVerification(context, {email, type});

  return context.json('Verification sended successfully.', 202);
});

auth.use(
  postLinkedEmailsSendVerificationRoute.getRoutingPath(),
  authentication
);
auth.openapi(postLinkedEmailsSendVerificationRoute, async context => {
  const {user} = context.env?.session as {user: string};
  const {email} = context.req.valid('json');

  const service = new SendLinkedEmailVerificationAuth(user, email);
  const response = await service.run();

  if (response.status === 401 || response.status === 404) {
    return context.json(response.error, response.status);
  }

  return context.json('Verification sended successfully.', 202);
});

auth.openapi(postLinkedEmailsVerifyRoute, async context => {
  const {token} = context.req.valid('query');

  const service = new VerifyLinkedEmail(token);
  const response = await service.run();

  if (response.status === 401 || response.status === 404) {
    return context.json(response.error, response.status);
  }

  return context.json('Linked email successfully verified.', 200);
});

auth.use(postLogoutRoute.getRoutingPath(), authentication);
auth.openapi(postLogoutRoute, context => {
  deleteSession(context);
  return context.json('User logout successfully.', 200);
});

export default auth;
