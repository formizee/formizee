import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle/migrations",
  schema: "src/data/db/schema.ts",
  dialect: 'sqlite',
  driver: 'd1'
});
