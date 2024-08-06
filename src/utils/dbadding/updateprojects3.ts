import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { projects } from "../../lib/schema.js";
import dotenv from "dotenv";
import { eq } from "drizzle-orm";

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

const db = drizzle(sql);

const updateProjectsPrimaryUid = async () => {
  try {
    const filePath = path.join(__dirname, "agoraProjects.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");

    // Ensure jsonData is parsed correctly
    let projectsData;
    try {
      const parsedData = JSON.parse(jsonData);
      console.log("Parsed JSON data:", parsedData);

      // Access the projects array
      projectsData = parsedData.projects;
      if (!Array.isArray(projectsData)) {
        throw new Error("Parsed data is not an array");
      }
    } catch (parseError) {
      console.error("Error parsing JSON data:", parseError);
      return;
    }

    console.log(`Number of projects parsed: ${projectsData.length}`);

    // Create a map of project names to IDs
    const projectNameToId = new Map();
    for (const project of projectsData) {
      projectNameToId.set(project.name, project.id);
    }

    // Fetch existing projects from the database
    const existingProjects = await db.select().from(projects);
    console.log(
      `Number of existing projects in DB: ${existingProjects.length}`
    );

    // Update the primaryprojectuid for existing projects that match by name
    for (const existingProject of existingProjects) {
      const newPrimaryUid = projectNameToId.get(existingProject.projectName);
      if (newPrimaryUid) {
        console.log(
          `Updating project: ${existingProject.projectName} with primaryprojectuid: ${newPrimaryUid}`
        );
        await db
          .update(projects)
          .set({ primaryprojectuid: newPrimaryUid })
          .where(eq(projects.projectName, existingProject.projectName));
      }
    }

    console.log("Projects updated in the database successfully.");
  } catch (error) {
    console.error("Error updating projects in the database:", error);
  }
};

updateProjectsPrimaryUid().catch((error) => {
  console.error("Unexpected error:", error);
});
