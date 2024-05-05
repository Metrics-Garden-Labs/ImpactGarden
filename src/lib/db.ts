import "./config";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql as vercelsql } from "@vercel/postgres";
import {
  users,
  projects,
  contributions,
  contributionattestations,
  user_addresses,
} from "./schema";
import * as schema from "./schema";
import { getAttestationsByAttester } from "./eas";
import { Waterfall } from "next/font/google";
import { eq } from "drizzle-orm";
import { Project, newUserAddresses } from "@/src/types";
import { count } from "console";
import { sql as drizzlesql } from "drizzle-orm";
import { inArray } from "drizzle-orm";

export const db = drizzle(vercelsql, { schema });

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

export const getUserByUsername = async (username: string) => {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (user.length === 0) {
      return null;
    }

    return user[0];
  } catch (error) {
    console.error(`Error retrieving user '${username}':`, error);
    throw error;
  }
};

// Function to insert or update user data including `pfp_url`
export const insertOrUpdateUser = async (user: NewUser) => {
  try {
    // Your logic to upsert a user record
    // Ensure you insert or update the `pfp_url` field
    return db
      .insert(users)
      .values(user)
      .onConflictDoUpdate({
        target: [users.fid],
        set: {
          username: user.username,
          ethaddress: user.ethaddress,
          pfp_url: user.pfp_url, // Ensure `pfp_url` is included here
        },
      })
      .returning();
  } catch (error) {
    console.error("Error inserting or updating user:", error);
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

// Function to fetch all projects associated with a specific FID
export const getProjectsByFids = async (userFids: string[]) => {
  try {
    const projectsByFids = await db
      .select()
      .from(projects)
      .where(inArray(projects.userFid, userFids));

    return projectsByFids;
  } catch (error) {
    console.error(`Error retrieving projects for user FIDs:`, error);
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

export type NewAttestation = typeof contributionattestations.$inferInsert;

//going to use this one to get the count of the attestations for a contribution

export const getAttestationsByContribution = async (contribution: string) => {
  try {
    const dbAttestations = await db
      .select()
      .from(contributionattestations)
      .where(eq(contributionattestations.contribution, contribution));

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
      .insert(contributionattestations)
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
      .from(contributionattestations)
      .where(eq(contributionattestations.projectName, projectName))
      .execute();

    return attestationCount;
  } catch (error) {
    console.error("Error retrieving project attestation count:", error);
    throw error;
  }
};

// src/lib/db.ts

export const getAttestationsByUserId = async (userFid: string) => {
  try {
    const attestations = await db
      .select()
      .from(contributionattestations)
      .where(eq(contributionattestations.userFid, userFid))
      .execute();
    return attestations;
  } catch (error) {
    console.error(
      `Error retrieving attestations for user '${userFid}':`,
      error
    );
    throw error;
  }
};

//for adding the user address to the db
export type NewUserAddress = typeof schema.user_addresses.$inferInsert;

export const insertUserAddress = async (addresses: newUserAddresses[]) => {
  try {
    const userAddressInsert = await db
      .insert(user_addresses)
      .values(addresses)
      .returning();
    console.log("User Address Insert", userAddressInsert);
    return userAddressInsert;
  } catch (error) {
    console.error("Error inserting user address:", error);
    throw error;
  }
};

export const getUserAddressesByFid = async (userFid: string) => {
  try {
    const addresses = await db
      .select()
      .from(user_addresses)
      .where(eq(user_addresses.userfid, userFid))
      .execute();
    return addresses;
  } catch (error) {
    console.error(`Error retrieving user addresses for '${userFid}':`, error);
    throw error;
  }
};

//not sure about this one.
export const updateEthereumAddressStatus = async (
  userFid: string,
  ethAddress: string,
  statusUpdates: Partial<newUserAddresses>
) => {
  try {
    const updated = await db
      .update(user_addresses)
      .set(statusUpdates)
      .where(
        eq(user_addresses.userfid, userFid) &&
          eq(user_addresses.ethaddress, ethAddress)
      )
      .returning();
    return updated;
  } catch (error) {
    console.error("Error updating Ethereum address status:", error);
    throw error;
  }
};
