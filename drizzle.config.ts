import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();
// const POSTGRES_URL = process.env.POSTGRES_URL;
const POSTGRES_URL =
  "postgres://default:vPYpbxnW31rf@ep-calm-union-a4ngoy74-pooler.us-east-1.aws.neon.tech/verceldb?sslmode=require";

console.log("postgres", process.env.POSTGRES_URL);

export default defineConfig({
  schema: "./src/lib/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: POSTGRES_URL as string,
  },
  verbose: true,
  strict: true,
});
