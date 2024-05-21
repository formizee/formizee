import { AuthLogin, AuthRegister } from '@/useCases/auth';
import {createSession, deleteSession} from '@/lib/auth';
import { StatusCode } from 'hono/utils/http-status';
import { Hono } from 'hono';


const authRouter = new Hono();

authRouter.get('/status', async context => {
  return context.json('OK', 200);
});

authRouter.post('/login', async context => {
  const {email, password} = await context.req.json<{
    email: string;
    password: string;
  }>();

  const service = new AuthLogin(email, password);
  const user = await service.run();

  if(!user.ok) return context.json(user.body, user.status as StatusCode);

  await createSession(context, user.body.uid);

  return context.json(user.body, 201);
});

authRouter.post('/register', async context => {
  const {name, email, password} = await context.req.json<{
    name: string;
    email: string;
    password: string;
  }>();

  const service = new AuthRegister(name, email, password);
  const user = await service.run();

  if(!user.ok) return context.json(user.body, user.status as StatusCode);

  await createSession(context, user.body.uid);

  return context.json(user.body, 201);
});

authRouter.post('/logout', async context => {
  await deleteSession(context);
  return context.json('OK', 200);
});

export default authRouter;
