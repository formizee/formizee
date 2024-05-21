import { SaveUser, LoadUser, LoadUserPasswordHash } from "@/useCases/users";
import { Uid } from "domain/models/values";
import { Hono } from "hono";

import { createSession, deleteSession } from "@/lib/auth";
import { compare } from "bcryptjs";

const authRouter = new Hono();

authRouter.get("/status", async (context) => {
  return context.json("OK", 200);
})

authRouter.post("/login", async (c) => {
  const {email, password} = await c.req.json<{email: string, password: string}>();

  // 1. Validate data
  const load = new LoadUser(email); 
  const user = await load.run();

  if(user.status === 404) return c.json({error: "Invalid credentials"}, 401);

  // 2. Validate login
  const loadPassword = new LoadUserPasswordHash(user.body.uid);
  const passwordHash = await loadPassword.run();

  if(passwordHash.status !== 200) return c.json({error: "Internal Error"}, 500);

  const isValid = await compare(password, passwordHash.body);
  if (!isValid) return c.json({error: "Invalid credentials"}, 401);

  // 3. Create a user session
  await createSession(c, new Uid(user.body.uid))

  return c.json(user.body, 201);
})

authRouter.post("/register", async (c) => {
  const {name, email, password} = await c.req.json<{name: string, email: string, password: string}>();

  // 1. Validate data
  const load = new LoadUser(email); 
  const userExists = await load.run();

  if(userExists.status !== 404) return c.json({error: "User already exists"}, 409);

  // 2. Insert data on database
  const save = new SaveUser(name, email, password); 
  const userSaved = await save.run();

  if(userSaved.status !== 201) return c.json({error: "Internal Error"}, 500);

  // 3. Create a user session
  await createSession(c, new Uid(userSaved.body.uid))

  return c.json(userSaved.body, 201);
})

authRouter.post("/logout", async (c) => {
  await deleteSession(c)

  return c.json("OK", 200);
})

export default authRouter;
