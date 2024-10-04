import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { op_delegates } from "../../../lib/schema";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const POSTGRES_URL = process.env.POSTGRES_URL;

if (!POSTGRES_URL) {
  console.error("POSTGRES_URL environment variable is not set.");
  process.exit(1); // Exit with failure
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = drizzle(sql); // The connection string should be picked up from the environment

const addDelegatesToDB = async () => {
  try {
    const filePath = path.join(__dirname, "all_delegates.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const delegates = JSON.parse(jsonData);

    for (const delegate of delegates) {
      await db
        .insert(op_delegates)
        .values({
          address: delegate.address,
          twitter: delegate.twitter,
        })
        .onConflictDoNothing()
        .returning();
    }

    console.log("Delegates added to the database successfully.");
  } catch (error) {
    console.error("Error adding delegates to the database:", error);
  }
};

addDelegatesToDB();
