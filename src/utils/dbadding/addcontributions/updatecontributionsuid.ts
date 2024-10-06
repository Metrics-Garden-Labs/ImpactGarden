import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { createPool } from "@vercel/postgres";
import dotenv from "dotenv";
import { projects, contributions } from "../../../lib/schema.js";
import { eq, and, isNull } from "drizzle-orm";

// Load environment variables from .env file
dotenv.config();

const POSTGRES_URL = process.env.POSTGRES_URL;

if (!POSTGRES_URL) {
  console.error("POSTGRES_URL environment variable is not set.");
  process.exit(1); // Exit with failure
}

const pool = createPool({ connectionString: POSTGRES_URL });

// Pass the pool to drizzle
const db = drizzle(pool);

const updateContributionsWithProjectUIDs = async () => {
  try {
    // Fetch existing contributions that need to be updated
    const contributionsToUpdate = await db
      .select({
        id: contributions.id,
        projectName: contributions.projectName,
      })
      .from(contributions)
      .where(
        and(
          isNull(contributions.primarycontributionuid),
          isNull(contributions.easUid)
        )
      );

    console.log(
      `Number of contributions to update: ${contributionsToUpdate.length}`
    );

    for (const contribution of contributionsToUpdate) {
      const { id, projectName } = contribution;

      // Fetch the corresponding project data
      const projectData = await db
        .select({
          primaryProjectUid: projects.primaryprojectuid,
          projectUid: projects.projectUid,
        })
        .from(projects)
        .where(eq(projects.projectName, projectName))
        .execute();

      if (projectData.length > 0) {
        const { primaryProjectUid, projectUid } = projectData[0];

        console.log(
          `Updating contribution ID ${id} with primaryProjectUid: ${primaryProjectUid}, projectUid: ${projectUid}`
        );

        // Update the contribution record
        await db
          .update(contributions)
          .set({
            primarycontributionuid: primaryProjectUid,
            easUid: projectUid,
          })
          .where(eq(contributions.id, id))
          .execute();
      }
    }

    console.log("Contributions updated successfully.");
  } catch (error) {
    console.error("Error updating contributions:", error);
  }
};

updateContributionsWithProjectUIDs().catch((error) => {
  console.error("Unexpected error:", error);
});
