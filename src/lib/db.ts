import "./config";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import {
  users,
  projects,
  contributions,
  contributionAttestations,
} from "./schema";
import * as schema from "./schema";
import { getAttestationsByAttester } from "./eas";
import { Waterfall } from "next/font/google";
import { eq } from "drizzle-orm";
import { Project } from "@/src/types";
import { count } from "console";

export const db = drizzle(sql, { schema });

export const getUsers = async () => {
  try {
    const selectResult = await db.select().from(users);
    console.log("Results", selectResult);
    return selectResult;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

//for the users table
export type NewUser = typeof users.$inferInsert;

export const insertUser = async (user: NewUser) => {
  try {
    return db.insert(users).values(user).returning();
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error;
  }
};

export const getUsers2 = async () => {
  try {
    const result = await db.query.users.findMany();
    return result;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

//for the projects table
export type NewProject = typeof projects.$inferInsert;

export const getProjects = async (walletAddress: string, endpoint: string) => {
  try {
    console.log("Wallet Address db", walletAddress);
    console.log("Endpoint db", endpoint);
    const dbProjects: Project[] = await db.select().from(projects);
    console.log("DB Projects", dbProjects);
    let easProjects: Project[] = [];
    //issue at the moment is that the easProjects does not show up by defaault, only when you query them
    if (walletAddress && endpoint) {
      const attestations = await getAttestationsByAttester(
        walletAddress,
        endpoint
      );
      easProjects = attestations
        .map((attestation: any) => {
          try {
            const decodedData = JSON.parse(attestation.decodedDataJson);
            return {
              id: attestation.id,
              projectName:
                decodedData.find((item: any) => item.name === "projectName")
                  ?.value?.value || "",
              twitterUrl:
                decodedData.find((item: any) => item.name === "twitterUrl")
                  ?.value?.value || "",
              websiteUrl:
                decodedData.find((item: any) => item.name === "websiteUrl")
                  ?.value?.value || "",
              githubUrl:
                decodedData.find((item: any) => item.name === "githubUrl")
                  ?.value?.value || "",
              ethAddress: attestation.recipient,
            };
          } catch (error) {
            console.error("Error parsing attestation data:", error);
            return null;
          }
        })
        .filter(
          (project: Project | null): project is Project => project !== null
        );
    }

    const combinedProjects: Project[] = [...dbProjects, ...easProjects];
    console.log("Combined projects", combinedProjects);

    return combinedProjects;
  } catch (error) {
    console.error("Error retrieving projects:", error);
    throw error;
  }
};

//brother need to refresh on how this works
export const insertProject = async (project: NewProject) => {
  try {
    return db.insert(projects).values(project).returning();
  } catch (error) {
    console.error("Error inserting project:", error);
    throw error;
  }
};

export const getProjectByName = async (projectName: string) => {
  try {
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.projectName, projectName))
      .limit(1);

    if (project.length === 0) {
      throw new Error(`Project not found: ${projectName}`);
    }

    return project[0];
  } catch (error) {
    console.error(`Error retrieving project '${projectName}':`, error);
    throw error;
  }
};

//for the contributions table
export type NewContribution = typeof contributions.$inferInsert;

export const getContributionsByProjectName = async (projectName: string) => {
  try {
    const dbcontributions = await db
      .select()
      .from(contributions)
      .where(eq(contributions.projectName, projectName));
    return dbcontributions;
  } catch (error) {
    console.error("Error retrieving contributions:", error);
    throw error;
  }
};

export const insertContribution = async (contribution: NewContribution) => {
  try {
    return db.insert(contributions).values(contribution).returning();
  } catch (error) {
    console.error("Error inserting contribution:", error);
    throw error;
  }
};

// src/lib/db.ts

//for the attest contributions table
//same stuff as before, figure a way to make the attestations, make them delegated etc, and then insert them into the db, to store and fetch the number that have been made.

export type NewAttestation = typeof contributionAttestations.$inferInsert;

//going to use this one to get the count of the attestations for a contribution

export const getAttestationsByContribution = async (contribution: string) => {
  try {
    const dbAttestations = await db
      .select()
      .from(contributionAttestations)
      .where(eq(contributionAttestations.contribution, contribution));

    return dbAttestations;
  } catch (error) {
    console.error("Error retrieving attestations:", error);
    throw error;
  }
};

export const insertAttestation = async (attestation: NewAttestation) => {
  try {
    console.log("Inserting attestation into the database");
    const result = await db
      .insert(contributionAttestations)
      .values(attestation)
      .returning();
    console.log("Attestation inserted successfully");
    return result;
  } catch (error) {
    console.error("Error inserting attestation:", error);
    throw error;
  }
};

export const getAttestationCountByProject = async (projectName: string) => {
  try {
    const attestationCount = await db
      .select({})
      .from(contributionAttestations)
      .where(eq(contributionAttestations.projectName, projectName))
      .execute();

    return attestationCount;
  } catch (error) {
    console.error("Error retrieving project attestation count:", error);
    throw error;
  }
};
