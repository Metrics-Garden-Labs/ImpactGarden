// //config for the vercel Postgres with drizzle Orm

// import { loadEnvConfig } from "@next/env";

// const projectDir = process.cwd();
// loadEnvConfig(projectDir);

// src/lib/config.ts

import { config } from "dotenv";

// Load environment variables from .env file
config();

const POSTGRES_URL =
  "postgres://default:4PYgnlCu3IhM@ep-calm-union-a4ngoy74-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require";

console.log("postgres", POSTGRES_URL);

export const dbConfig = {
  url: POSTGRES_URL as string,
};
