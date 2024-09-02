import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { contributions } from "../../lib/schema.js";
import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

// Load environment variables from .env file
dotenv.config();
//
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

const db = drizzle(sql);
const client = new NeynarAPIClient(NEYNAR_API_KEY);

const fetchUserFidAndEthAddress = async (projectNames: any) => {
  const userFidMap = new Map();

  for (const projectName of projectNames) {
    const fidData = await client.fetchBulkUsers([projectName]);
    const userData = fidData.users[0];

    if (userData) {
      const userFid = userData.fid;
      const ethAddress =
        userData.verified_addresses?.eth_addresses?.[0] ||
        "0x0000000000000000000000000000000000000000";

      userFidMap.set(projectName, { userFid, ethAddress });
    }
  }

  return userFidMap;
};

const updateContributionsInDB = async () => {
  try {
    const filePath = path.join(__dirname, "agoraProjects.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");

    let projectsData;
    try {
      const parsedData = JSON.parse(jsonData);
      console.log("Parsed JSON data:", parsedData);

      projectsData = parsedData.projects;
      if (!Array.isArray(projectsData)) {
        throw new Error("Parsed data is not an array");
      }
    } catch (parseError) {
      console.error("Error parsing JSON data:", parseError);
      return;
    }

    console.log(`Number of projects parsed: ${projectsData.length}`);

    const existingContributions = await db.select().from(contributions);
    console.log(
      `Number of existing contributions in DB: ${existingContributions.length}`
    );

    const projectNames = projectsData.map((project) => project.name);
    const userFidMap = await fetchUserFidAndEthAddress(projectNames);

    for (const existingContribution of existingContributions) {
      const userFidAndEthAddress = userFidMap.get(
        existingContribution.projectName
      );

      if (userFidAndEthAddress) {
        const { userFid, ethAddress } = userFidAndEthAddress;

        console.log(
          `Updating contribution: ${existingContribution.projectName} with userFid: ${userFid} and ethAddress: ${ethAddress}`
        );

        await db
          .update(contributions)
          .set({ userFid, ethAddress })
          .where(
            eq(contributions.projectName, existingContribution.projectName)
          );
      }
    }

    console.log("Contributions updated in the database successfully.");
  } catch (error) {
    console.error("Error updating contributions in the database:", error);
  }
};

const addContributionsToDB = async () => {
  try {
    const filePath = path.join(__dirname, "projects.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const projectsData = JSON.parse(jsonData);

    const projectNames = projectsData.map((project: any) => project.name);
    const userFidMap = await fetchUserFidAndEthAddress(projectNames);

    for (const project of projectsData) {
      const userFidAndEthAddress = userFidMap.get(project.name);
      const userFid = userFidAndEthAddress
        ? userFidAndEthAddress.userFid
        : null;
      const ethAddress = userFidAndEthAddress
        ? userFidAndEthAddress.ethAddress
        : "";

      await db
        .insert(contributions)
        .values({
          userFid: userFid || "9999999",
          projectName: project.name,
          ecosystem: "Optimism",
          governancetype: project.governancetype || "",
          secondaryecosystem: project.secondaryecosystem || "",
          contribution: project.name,
          desc: project.description,
          link: project.link || "",
          ethAddress: ethAddress || "",
          easUid: null,
        })
        .onConflictDoNothing()
        .returning();
    }

    console.log("Contributions added to the database successfully.");
  } catch (error) {
    console.error("Error adding contributions to the database:", error);
  }
};

const updateContributionsCategory = async () => {
  try {
    const filePath = path.join(__dirname, "agoraProjects.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const projectsData = JSON.parse(jsonData);

    for (const project of projectsData.projects) {
      const projectName = project.name;
      const subcategory = project.category;

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

const main = async () => {
  try {
    await addContributionsToDB();
    await updateContributionsInDB();
    await updateContributionsCategory();
    console.log("All operations completed successfully.");
  } catch (error) {
    console.error("Unexpected error:", error);
  }
};

main().catch((error) => {
  console.error("Unexpected error in main:", error);
});
