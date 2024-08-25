import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql, eq } from "drizzle-orm";
import { sql as vsql } from "@vercel/postgres";
import { projects } from "../../lib/schema.js";
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

const addProjectsToDB = async () => {
  try {
    const filePath = path.join(__dirname, "graphQLProjects2.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const projectsData = JSON.parse(jsonData);

    for (const project of projectsData) {
      // Extract userFid from the team array (first element)
      const userFid = project.team?.[0] || "9999999"; // Default to "9999999" if team array is empty

      // Check if the project name already exists in the database
      const existingProject = await db
        .select()
        .from(projects)
        .where(eq(projects.projectName, project.name))
        .limit(1);

      if (existingProject.length > 0) {
        console.log(
          `Project '${project.name}' already exists in the database. Skipping...`
        );
        continue;
      }

      // Assume category is "OP Stack"
      const category = "OP Stack";

      await db
        .insert(projects)
        .values({
          userFid: userFid, // Use the userFid extracted from the team array
          ethAddress: "0x0000000000000000000000000000000000000000", // Ethereum zero address
          ecosystem: "Optimism",
          primaryprojectuid: project.primaryprojectuid || "", // Use the correct primaryprojectuid
          projectName: project.name,
          category: category,
          oneliner: project.description,
          websiteUrl: project.socialLinks?.website?.[0] || "",
          twitterUrl: project.socialLinks?.twitter || "",
          githubUrl: project.github?.[0] || "",
          logoUrl: project.projectAvatarUrl || "",
          projectUid: project.projectUid || "", // Use the correct projectUid
        })
        .onConflictDoNothing()
        .returning();
    }

    console.log("Projects added to the database successfully.");
  } catch (error) {
    console.error("Error adding projects to the database:", error);
  }
};

addProjectsToDB().catch((error) => {
  console.error("Unexpected error:", error);
});
