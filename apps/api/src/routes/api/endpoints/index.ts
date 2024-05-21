import {LoadEndpointsByOwner, SaveEndpoint} from '@/useCases/endpoints';
import {StatusCode} from 'hono/utils/http-status';
import {Hono} from 'hono';

import {verifySession} from '@/lib/auth';

const router = new Hono();

router.get('/', async context => {
  const {isAuth, user} = await verifySession(context);
  if (!isAuth || !user)
    return context.json(
      {error: 'Please, login first in order to do this action'},
      401
    );

  const service = new LoadEndpointsByOwner(user);
  const response = await service.run();

  return context.json(response.body, response.status as StatusCode);
});

router.post('/', async context => {
  const {isAuth, user} = await verifySession(context);
  if (!isAuth || !user)
    return context.json(
      {error: 'Please, login first in order to do this action'},
      401
    );

  const {name} = await context.req.json<{name: string}>();

  const service = new SaveEndpoint(name, user);
  const response = await service.run();

  return context.json(response.body, response.status as StatusCode);
});

export default router;
