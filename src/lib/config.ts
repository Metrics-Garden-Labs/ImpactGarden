// //config for the vercel Postgres with drizzle Orm

// import { loadEnvConfig } from "@next/env";

// const projectDir = process.cwd();
// loadEnvConfig(projectDir);

// src/lib/config.ts

import { config } from "dotenv";

// Load environment variables from .env file
config();

const POSTGRES_URL = process.env.POSTGRES_URL;

export const dbConfig = {
  url: POSTGRES_URL as string,
};
