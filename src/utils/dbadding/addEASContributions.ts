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

console.log("POSTGRES_URL:", POSTGRES_URL);

process.env.POSTGRES_URL = POSTGRES_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = drizzle(vsql);

const addContributionsToDB = async () => {
  try {
    const filePath = path.join(__dirname, "easprojectsopstack1.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const projectsData = JSON.parse(jsonData);

    for (const project of projectsData) {
      // Extract userFid from the team array (first element)
      const userFid = project.team?.[0] || "9999999"; // Default to "9999999" if team array is empty

      // Check if the contribution already exists in the database
      const existingContribution = await db
        .select()
        .from(contributions)
        .where(eq(contributions.contribution, project.name))
        .limit(1);

      if (existingContribution.length > 0) {
        console.log(
          `Contribution '${project.name}' already exists in the database. Skipping...`
        );
        continue;
      }

      const category = "OP Stack";

      await db
        .insert(contributions)
        .values({
          userFid: userFid,
          projectName: project.name,
          ecosystem: "Optimism", // Assume the same ecosystem as the project
          governancetype: "", // Empty governance type
          category: category, // Use the category
          subcategory: "", // Empty subcategory
          contribution: project.name, // Use project name as contribution
          desc: project.description, // Use project description
          link: project.socialLinks?.website?.[0] || "", // Use website as the link, if available
          ethAddress:
            project.ethAddress || "0x0000000000000000000000000000000000000000", // Use Ethereum zero address if not provided
          primarycontributionuid: project.primaryprojectuid || "", // Use primary project UID as primary contribution UID
          easUid: project.projectUid || "", // Use project UID as EAS UID
        })
        .onConflictDoNothing()
        .returning();
    }

    console.log("Contributions added to the database successfully.");
  } catch (error) {
    console.error("Error adding contributions to the database:", error);
  }
};

addContributionsToDB().catch((error) => {
  console.error("Unexpected error:", error);
});
