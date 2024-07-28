import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();
console.log("postgres", process.env.POSTGRES_URL);

export default defineConfig({
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL as string,
  },
  verbose: true,
  strict: true,
});
