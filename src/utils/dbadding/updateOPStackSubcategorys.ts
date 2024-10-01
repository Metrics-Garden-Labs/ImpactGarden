import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import dotenv from "dotenv";
import { contributions } from "../../lib/schema.js";
import { eq } from "drizzle-orm";

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

// Mapping categories to subcategories
const categoryToSubcategory: Record<string, string> = {
  OP_STACK_RESEARCH_AND_DEVELOPMENT: "OP Stack Research and Development",
  ETHEREUM_CORE_CONTRIBUTIONS: "Ethereum Core Contributions",
  OP_STACK_TOOLING: "OP Stack Tooling",
};

const updateContributionsWithSubcategories = async () => {
  try {
    const filePath = path.join(__dirname, "agoraRound5.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");

    // Parse the JSON data
    const parsedData = JSON.parse(jsonData);
    const projectsData = parsedData.data;

    console.log(`Number of projects parsed: ${projectsData.length}`);

    // Fetch existing contributions that have an empty subcategory
    const contributionsToUpdate = await db
      .select({
        id: contributions.id,
        projectName: contributions.projectName,
      })
      .from(contributions)
      .where(eq(contributions.subcategory, "")) // Check for empty string instead of NULL
      .execute();

    console.log(
      `Number of contributions to update: ${contributionsToUpdate.length}`
    );

    // Create a map of project names to relevant fields
    const projectNameToCategory = new Map();
    for (const project of projectsData) {
      projectNameToCategory.set(project.name, project.applicationCategory);
    }

    // Update each contribution
    for (const contribution of contributionsToUpdate) {
      const { id, projectName } = contribution;

      const applicationCategory = projectNameToCategory.get(projectName);

      if (applicationCategory) {
        const subcategory = categoryToSubcategory[applicationCategory];

        if (subcategory) {
          console.log(
            `Updating contribution ID ${id} with subcategory: ${subcategory}`
          );

          // Update the contribution record with the subcategory
          await db
            .update(contributions)
            .set({
              subcategory: subcategory,
            })
            .where(eq(contributions.id, id))
            .execute();
        }
      }
    }

    console.log("Contributions updated successfully.");
  } catch (error) {
    console.error("Error updating contributions:", error);
  }
};

updateContributionsWithSubcategories().catch((error) => {
  console.error("Unexpected error:", error);
});
