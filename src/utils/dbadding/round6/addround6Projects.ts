import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql, eq } from "drizzle-orm";
import { sql as vsql } from "@vercel/postgres";
import { projects } from "../../../lib/schema";
import dotenv from "dotenv";
import { NeynarAPIClient } from "@neynar/nodejs-sdk"; // Import NeynarAPIClient

// Load environment variables from .env file
dotenv.config();

const POSTGRES_URL = process.env.POSTGRES_URL;
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

if (!POSTGRES_URL) {
  console.error("POSTGRES_URL environment variable is not set.");
  process.exit(1); // Exit with failure
}

if (!NEYNAR_API_KEY) {
  console.error("NEYNAR_API_KEY environment variable is not set.");
  process.exit(1); // Exit with failure
}

process.env.POSTGRES_URL = POSTGRES_URL;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = drizzle(vsql);
const client = new NeynarAPIClient(NEYNAR_API_KEY); // Initialize NeynarAPIClient

const addProjectsToDB = async () => {
  try {
    const filePath = path.join(__dirname, "Round6Projects2.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const projectsData = JSON.parse(jsonData);

    for (const project of projectsData) {
      // Extract userFid from the team array (first element)
      const userFid =
        project.userFid?.toString() ||
        (project.team && project.team[0]) ||
        "9999999"; // Default to "9999999" if not available

      // Check if the project name already exists in the database
      const existingProject = await db
        .select()
        .from(projects)
        .where(eq(projects.projectName, project.projectName || project.name))
        .limit(1);

      if (existingProject.length > 0) {
        console.log(
          `Project '${
            project.projectName || project.name
          }' already exists in the database. Skipping...`
        );
        continue;
      }

      // Assume category is from the project data or default to "Governance"
      const category = "Governance";

      // Extract GitHub URL
      let githubUrl = "";
      if (Array.isArray(project.github) && project.github.length > 0) {
        githubUrl = project.github[0].url || "";
      } else if (typeof project.github === "object" && project.github.url) {
        githubUrl = project.github.url;
      } else if (typeof project.github === "string") {
        githubUrl = project.github;
      }

      // Extract website URL
      let websiteUrl = "";
      if (project.socialLinks && project.socialLinks.website) {
        if (
          Array.isArray(project.socialLinks.website) &&
          project.socialLinks.website.length > 0
        ) {
          websiteUrl = project.socialLinks.website[0];
        } else if (typeof project.socialLinks.website === "string") {
          websiteUrl = project.socialLinks.website;
        }
      }

      // Extract Twitter URL
      const twitterUrl = project.socialLinks?.twitter || "";

      // Extract logo URL
      const logoUrl = project.projectAvatarUrl || "";

      // Extract oneliner from impactStatement
      let oneliner = "";
      //   if (Array.isArray(project.impactStatement)) {
      //     // Combine all answers into a single string
      //     // oneliner = project.impactStatement
      //     //   .map((statement: any) => statement.answer)
      //     //   .filter((answer: string) => !!answer)
      //     //   .join(" ");
      //   } else {
      //     oneliner = project.description || "";
      //   }

      oneliner = project.description || "";

      // Fetch ethAddress using NeynarAPIClient
      let ethAddress = "0x0000000000000000000000000000000000000000"; // Default to zero address
      if (userFid && userFid !== "9999999") {
        try {
          console.log(`Fetching data for userFid: ${userFid}`);
          const fidData = await client.fetchBulkUsers([parseInt(userFid)]);
          const userData = fidData.users[0];

          ethAddress =
            userData?.verified_addresses?.eth_addresses?.[0] ||
            "0x0000000000000000000000000000000000000000";
          console.log(`Fetched ethAddress: ${ethAddress}`);
        } catch (error) {
          console.error(`Error fetching data for userFid ${userFid}:`, error);
        }
      }

      // Prepare data for insertion
      const projectData = {
        userFid: userFid,
        ethAddress: ethAddress,
        ecosystem: "Optimism",
        projectName: project.projectName || project.name,
        category: category,
        oneliner: oneliner,
        websiteUrl: websiteUrl,
        twitterUrl: twitterUrl,
        githubUrl: githubUrl,
        logoUrl: logoUrl,
        primaryprojectuid: project.primaryProjectUid || "", // Corrected key name
        projectUid: project.projectUid || "",
      };

      // Insert the project into the database
      await db
        .insert(projects)
        .values(projectData)
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
