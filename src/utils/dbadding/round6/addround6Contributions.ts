import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql as vsql } from "@vercel/postgres";
import { contributions } from "../../../lib/schema";
import dotenv from "dotenv";
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { eq } from "drizzle-orm";

// Load environment variables from .env file
dotenv.config();

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const POSTGRES_URL = process.env.POSTGRES_URL;

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
    const filePath = path.join(__dirname, "Round7Projects.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const projectsData = JSON.parse(jsonData);

    for (const project of projectsData) {
      const userFid =
        project.userFid?.toString() || project.team?.[0] || "9999999";

      // Fetch ethAddress using NeynarAPIClient
      let ethAddress = "0x0000000000000000000000000000000000000000";
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

      const governancetype = "";
      const category = "Governance";
      const subcategoryBefore = project.category || "";
      let subcategory = subcategoryBefore;
      if (subcategoryBefore === "Governace Infra & Tooling") {
        subcategory = "Infra & Tooling";
      }
      if (subcategoryBefore === "Governance Analytics") {
        subcategory = "Governance Research & Analytics";
      }

      let desc = "";
      if (Array.isArray(project.impactStatement)) {
        desc = project.impactStatement
          .map((statement: { answer: string }) => statement.answer)
          .filter((answer: string) => !!answer)
          .join(" ");
      } else {
        desc = project.description || "";
      }

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

      const primarycontributionuid = project.metadataSnapshotUID || "";
      const easUid = project.projectUid || "";

      const contributionData = {
        userFid: userFid,
        projectName: project.projectName || project.name || "",
        ecosystem: "Optimism",
        governancetype: governancetype,
        category: category,
        subcategory: subcategory,
        contribution: project.name || project.projectName || "",
        desc: desc,
        link: link,
        ethAddress: ethAddress,
        primarycontributionuid: primarycontributionuid,
        easUid: easUid,
      };

      // Check if the contribution already exists
      const existingContribution = await db
        .select()
        .from(contributions)
        .where(eq(contributions.contribution, contributionData.contribution))
        .limit(1);

      if (existingContribution.length > 0) {
        console.log(
          `Skipping existing contribution: ${contributionData.contribution}`
        );
      } else {
        // Insert the contribution into the database if it doesn't already exist
        await db
          .insert(contributions)
          .values(contributionData)
          .catch((error) => {
            console.error(
              `Error inserting contribution for userFid ${userFid}:`,
              error
            );
          });
        console.log(`Added new contribution: ${contributionData.contribution}`);
      }
    }

    console.log("Contributions added to the database successfully.");
  } catch (error) {
    console.error("Error adding contributions to the database:", error);
  }
};

addContributionsToDB().catch((error) => {
  console.error("Unexpected error:", error);
});
