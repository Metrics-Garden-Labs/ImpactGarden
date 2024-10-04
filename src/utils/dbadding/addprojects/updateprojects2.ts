//the purpose of this script is to update the projects that have been added from the agora api to
//change the cateory to onchain builfers as this is the round they are from

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { projects } from "../../../lib/schema.js";
import dotenv from "dotenv";
import { eq, and, isNotNull } from "drizzle-orm";

// Load environment variables from .env file
dotenv.config();

const POSTGRES_URL = process.env.POSTGRES_URL;

if (!POSTGRES_URL) {
  console.error("POSTGRES_URL environment variable is not set.");
  process.exit(1); // Exit with failure
}

process.env.POSTGRES_URL = POSTGRES_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = drizzle(sql);

const updateProjectsCategory = async () => {
  try {
    const result = await db
      .update(projects)
      .set({ category: "Onchain Builders" })
      .where(and(isNotNull(projects.category)));
    console.log("Projects category updated successfully.");
  } catch (error) {
    console.error("Error updating projects category:", error);
  }
};

updateProjectsCategory().catch((error) => {
  console.error("Unexpected error:", error);
});
