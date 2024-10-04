import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { projects } from "../../../lib/schema.js";
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

const addProjectsToDB = async () => {
  try {
    const filePath = path.join(__dirname, "projects.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const projectsData = JSON.parse(jsonData);

    // Hardcoded userFid for the missing farcaster id
    const hardcodedUserFid = "9999999";

    for (const project of projectsData) {
      await db
        .insert(projects)
        .values({
          userFid: hardcodedUserFid,
          ethAddress: project.address,
          ecosystem: "Optimism",
          primaryprojectuid: project.projectUid, // Corrected usage
          projectName: project.name,
          category: project.category || "", // Assuming optional fields
          oneliner: project.description,
          websiteUrl: project.websiteUrl || "", // Assuming optional fields
          twitterUrl: project.twitterUrl || "",
          githubUrl: project.githubUrl || "",
          logoUrl: project.profileImageUrl || "",
          projectUid: project.id,
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
