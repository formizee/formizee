import { LoadEndpointsByOwner, SaveEndpoint } from "@/useCases/endpoints";
import { verifySession } from "@/lib/auth/dal";
import { Hono } from "hono";
import { StatusCode } from "hono/utils/http-status";

const router = new Hono();

router.get('/', async (c) => {
  const {isAuth, user} = await verifySession(c);
  if (!isAuth || !user) return c.json({error: "Please, login first in order to do this action"}, 401);

  const service = new LoadEndpointsByOwner(user);
  const response = await service.run(); 

  return c.json(response.body, response.status as StatusCode) ;
})

router.post('/', async (c) => {
  const {isAuth, user} = await verifySession(c);
  if (!isAuth || !user) return c.json({error: "Please, login first in order to do this action"}, 401);

  const {name} = await c.req.json<{name: string}>();

  const service = new SaveEndpoint(name, user);
  const response = await service.run(); 

  return c.json(response.body, response.status as StatusCode) ;
})

export default router;
