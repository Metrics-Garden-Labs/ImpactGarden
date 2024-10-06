//hopefully this will update all of the contributions in the database to the new format that we need them to adhere to

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { eq } from "drizzle-orm/expressions"; // Assuming you have this import or similar for expressions
import { contributions } from "../../../lib/schema.js";
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

const db = drizzle(sql);

const updateContributionsCategory = async () => {
  try {
    const filePath = path.join(__dirname, "agoraProjects.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const projectsData = JSON.parse(jsonData);

    for (const project of projectsData.projects) {
      const projectName = project.name;
      const subcategory = project.category;

      // Update the contributions table where the projectName matches
      await db
        .update(contributions)
        .set({
          category: "Onchain Builders",
          subcategory: subcategory,
        })
        .where(eq(contributions.projectName, projectName));
    }

    console.log("Contributions updated successfully.");
  } catch (error) {
    console.error("Error updating contributions in the database:", error);
  }
};

updateContributionsCategory().catch((error) => {
  console.error("Unexpected error:", error);
});
