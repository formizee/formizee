import { StatusCode } from "hono/utils/http-status";
import { WaitlistJoin } from "@/useCases/waitlist";
import { Hono } from "hono";

/* @ts-ignore-next-line */
import { zValidator } from "@hono/zod-validator";
import { joinSchema } from "./schema";

const router = new Hono();

router.post('/join', zValidator('json', joinSchema), async context => {
  const {email} = context.req.valid('json');

  const service = new WaitlistJoin(email);
  const response = await service.run();

  if (!response.ok) {
    return context.json(response.error, response.status as StatusCode);
  }

  return context.json("OK", response.status as StatusCode);
})

export default router;
