import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "src/data/models",
  out: "./drizzle/migrations",
  dialect: 'sqlite',
  driver: 'd1'
});
