import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql, eq } from "drizzle-orm";
import { sql as vsql } from "@vercel/postgres";
import { contributions } from "../../../lib/schema";
import dotenv from "dotenv";
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

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
const client = new NeynarAPIClient(NEYNAR_API_KEY);

const addContributionsToDB = async () => {
  try {
    const filePath = path.join(__dirname, "Round6Projects.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const projectsData = JSON.parse(jsonData);

    for (const project of projectsData) {
      // Extract userFid from the team array (first element)
      const userFid =
        project.userFid?.toString() || project.team?.[0] || "9999999"; // Default to "9999999" if not available

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

      const governancetype = ""; // Empty governance type
      const category = "Governance"; // Use the category specified
      const subcategoryBefore = project.category || ""; // Use the category from JSON file
      let subcategory = subcategoryBefore;
      if (subcategoryBefore === "Governace Infra & Tooling") {
        subcategory = "Infra & Tooling";
      }
      if (subcategoryBefore === "Governance Analytics") {
        subcategory = "Governance Research & Analytics";
      }

      // Extract description from impactStatement
      let desc = "";
      if (Array.isArray(project.impactStatement)) {
        // Combine all answers into a single string
        desc = project.impactStatement
          .map((statement: any) => statement.answer)
          .filter((answer: string) => !!answer)
          .join(" ");
      } else {
        desc = project.description || "";
      }

      // Extract link from links object
      let link = "";
      if (Array.isArray(project.links) && project.links.length > 0) {
        link = project.links[0].url || "";
      } else if (
        project.socialLinks &&
        Array.isArray(project.socialLinks.website) &&
        project.socialLinks.website.length > 0
      ) {
        link = project.socialLinks.website[0];
      }

      // primaryContributionUid is the metadataSnapshotUID
      const primarycontributionuid = project.metadataSnapshotUID || "";

      // easUid is the projectUid
      const easUid = project.projectUid || "";

      // Prepare data for insertion
      const contributionData = {
        userFid: userFid,
        projectName: project.projectName || project.name || "",
        ecosystem: "Optimism", // Assume the same ecosystem as the project
        governancetype: governancetype,
        category: category,
        subcategory: subcategory,
        contribution: project.name || project.projectName || "", // Use project name as contribution
        desc: desc, // Use impact statement as description
        link: link, // Use link extracted from project.links or socialLinks
        ethAddress: ethAddress, // Use fetched ethAddress
        primarycontributionuid: primarycontributionuid,
        easUid: easUid,
      };

      // Insert the contribution into the database
      await db
        .insert(contributions)
        .values(contributionData)
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
