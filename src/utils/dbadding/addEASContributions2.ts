import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql, eq } from "drizzle-orm";
import { sql as vsql } from "@vercel/postgres";
import { contributions } from "../../lib/schema.js";
import dotenv from "dotenv";

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

const db = drizzle(vsql);

const updateContributionsCategory = async () => {
  try {
    const filePath = path.join(__dirname, "easprojectsopstack1.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const projectsData = JSON.parse(jsonData);

    for (const project of projectsData) {
      // Update only the category of contributions with the matching project name
      const result = await db
        .update(contributions)
        .set({
          category: "OP Stack", // Change category to OP Stack
        })
        .where(eq(contributions.contribution, project.name))
        .returning();

      if (result.length > 0) {
        console.log(
          `Updated category for contribution '${project.name}' to 'OP Stack'.`
        );
      } else {
        console.log(
          `No update performed for '${project.name}' as it doesn't exist in the database.`
        );
      }
    }

    console.log(
      "Contribution categories updated in the database successfully."
    );
  } catch (error) {
    console.error(
      "Error updating contribution categories in the database:",
      error
    );
  }
};

updateContributionsCategory().catch((error) => {
  console.error("Unexpected error:", error);
});
