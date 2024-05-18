import { GetUserUseCase } from "@/useCases/users/get";
import { Hono } from "hono";

export const usersRouter = new Hono();

usersRouter.get("/:uid", async (c) => {
  const uid = c.req.param('uid');

  const service = new GetUserUseCase(uid); 
  const user = await service.run();

  return c.json({user});
})

