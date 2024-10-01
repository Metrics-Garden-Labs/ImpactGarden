//config for using vercel postgres with drizzle orm

import { config } from "dotenv";

// Load environment variables from .env file
config();

const POSTGRES_URL = process.env.POSTGRES_URL;

export const dbConfig = {
  url: POSTGRES_URL as string,
};
