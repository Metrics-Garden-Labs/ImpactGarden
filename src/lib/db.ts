import "./config";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql as vercelsql } from "@vercel/postgres";
import {
  users,
  projects,
  contributions,
  contributionattestations,
  user_addresses,
  op_delegates,
} from "./schema";
import * as schema from "./schema";
import { getAttestationsByAttester } from "./eas";
import { Waterfall } from "next/font/google";
import {
  Project,
  newUserAddresses,
  Attestation,
  ProjectCount,
} from "@/src/types";
import { count } from "console";
import { desc, sql as drizzlesql } from "drizzle-orm";
import { inArray, eq, sql } from "drizzle-orm";

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

//get user badge for the verification and searchusers page
// src/lib/db.ts

export const getUsersVerification = async () => {
  try {
    const selectResult = await db
      .select({
        users: {
          id: users.id,
          fid: users.fid,
          username: users.username,
          ethaddress: users.ethaddress,
          pfp_url: users.pfp_url,
          createdAt: users.createdAt,
        },
        userAddresses: {
          coinbaseVerified: user_addresses.coinbaseverified,
          opBadgeholder: user_addresses.opbadgeholder,
          powerBadgeholder: user_addresses.powerbadgeholder,
        },
      })
      .from(users)
      .leftJoin(user_addresses, eq(users.fid, user_addresses.userfid));

    console.log("Results", selectResult);
    return selectResult;
  } catch (error) {
    console.error("Error retrieving users:", error);
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

// export const getProjects = async (walletAddress: string, endpoint: string, sortOrder: string = 'asc') => {
//   try {
//     console.log("Wallet Address db", walletAddress);
//     console.log("Endpoint db", endpoint);
//     let dbProjects: Project[] = await db.select().from(projects);
//     console.log("DB Projects", dbProjects);
//     if (sortOrder === 'recent') {
//       dbProjects = dbProjects.orderBy(desc(projects.createdAt));
//     }

//     //do not want to show the eas proejcts at the minute but could be useful in the future
//     // let easProjects: Project[] = [];
//     // //issue at the moment is that the easProjects does not show up by defaault, only when you query them
//     // if (walletAddress && endpoint) {
//     //   const attestations = await getAttestationsByAttester(
//     //     walletAddress,
//     //     endpoint
//     //   );
//     //   easProjects = attestations
//     //     .map((attestation: any) => {
//     //       try {
//     //         const decodedData = JSON.parse(attestation.decodedDataJson);
//     //         return {
//     //           id: attestation.id,
//     //           projectName:
//     //             decodedData.find((item: any) => item.name === "projectName")
//     //               ?.value?.value || "",
//     //           twitterUrl:
//     //             decodedData.find((item: any) => item.name === "twitterUrl")
//     //               ?.value?.value || "",
//     //           websiteUrl:
//     //             decodedData.find((item: any) => item.name === "websiteUrl")
//     //               ?.value?.value || "",
//     //           githubUrl:
//     //             decodedData.find((item: any) => item.name === "githubUrl")
//     //               ?.value?.value || "",
//     //           ethAddress: attestation.recipient,
//     //         };
//     //       } catch (error) {
//     //         console.error("Error parsing attestation data:", error);
//     //         return null;
//     //       }
//     //     })
//     //     .filter(
//     //       (project: Project | null): project is Project => project !== null
//     //     );
//     // }
//     //const combinedProjects: Project[] = [...dbProjects, ...easProjects];

//     const combinedProjects: Project[] = [...dbProjects];

//     console.log("Combined projects", combinedProjects);

//     return combinedProjects;
//   } catch (error) {
//     console.error("Error retrieving projects:", error);
//     throw error;
//   }
// };

const isProjectCount = (project: any): project is ProjectCount => {
  return "attestationCount" in project;
};

const isProjectRating = (project: any): project is ProjectCount => {
  return "averageRating" in project;
};

export const getProjects = async (
  walletAddress: string,
  endpoint: string,
  filter: string = ""
) => {
  try {
    console.log("Wallet Address db", walletAddress);
    console.log("Endpoint db", endpoint);
    console.log("Filter db", filter);

    if (filter === "Recently Added") {
      const recentlyAddedQuery = db
        .select()
        .from(projects)
        .orderBy(sql`${projects.createdAt} DESC`);
      const dbProjects: Project[] = await recentlyAddedQuery.execute();
      return dbProjects;
    } else if (filter === "Projects on Optimism") {
      const optimismQuery = db
        .select()
        .from(projects)
        .where(sql`${projects.ecosystem} = 'Optimism'`);
      const dbProjects: Project[] = await optimismQuery.execute();
      return dbProjects;
    } else if (filter === "Most Attested") {
      const attestedQuery = db
        .select({
          id: projects.id,
          userFid: projects.userFid,
          ethAddress: projects.ethAddress,
          ecosystem: projects.ecosystem,
          projectName: projects.projectName,
          oneliner: projects.oneliner,
          websiteUrl: projects.websiteUrl,
          twitterUrl: projects.twitterUrl,
          githubUrl: projects.githubUrl,
          logoUrl: projects.logoUrl,
          projectUid: projects.projectUid,
          createdAt: projects.createdAt,
          attestationCount:
            sql`CAST(COUNT(${contributionattestations.id}) AS INT)`.as(
              "attestationCount"
            ),
        })
        .from(projects)
        .leftJoin(
          contributionattestations,
          sql`${projects.projectName} = ${contributionattestations.projectName}`
        )
        .groupBy(
          projects.id,
          projects.userFid,
          projects.ethAddress,
          projects.ecosystem,
          projects.projectName,
          projects.oneliner,
          projects.websiteUrl,
          projects.twitterUrl,
          projects.githubUrl,
          projects.logoUrl,
          projects.projectUid,
          projects.createdAt
        )
        .orderBy(sql`COUNT(${contributionattestations.id}) DESC`);
      const dbProjects: (Project | ProjectCount)[] =
        await attestedQuery.execute();

      // Use type guard to filter and map projects
      const castedProjects = dbProjects.map((project) => {
        if (isProjectCount(project)) {
          return {
            ...project,
            attestationCount: Number(project.attestationCount),
          };
        }
        return project;
      }) as ProjectCount[];

      // Enhanced logging
      console.log("Raw database response:", castedProjects);
      console.log(`Number of projects returned: ${castedProjects.length}`);
      castedProjects.forEach((project, index) => {
        console.log(`Project ${index + 1}:`, project);
      });
      return castedProjects;
    } else if (filter === "Best Rated") {
      const bestRatedQuery = db
        .select({
          id: projects.id,
          userFid: projects.userFid,
          ethAddress: projects.ethAddress,
          ecosystem: projects.ecosystem,
          projectName: projects.projectName,
          oneliner: projects.oneliner,
          websiteUrl: projects.websiteUrl,
          twitterUrl: projects.twitterUrl,
          githubUrl: projects.githubUrl,
          logoUrl: projects.logoUrl,
          projectUid: projects.projectUid,
          createdAt: projects.createdAt,
          averageRating:
            sql`AVG(CAST(${contributionattestations.rating} AS FLOAT))`.as(
              "averageRating"
            ),
        })
        .from(projects)
        .leftJoin(
          contributionattestations,
          sql`${projects.projectName} = ${contributionattestations.projectName}`
        )
        .groupBy(
          projects.id,
          projects.userFid,
          projects.ethAddress,
          projects.ecosystem,
          projects.projectName,
          projects.oneliner,
          projects.websiteUrl,
          projects.twitterUrl,
          projects.githubUrl,
          projects.logoUrl,
          projects.projectUid,
          projects.createdAt
        )
        .orderBy(
          sql`AVG(CAST(${contributionattestations.rating} AS FLOAT)) DESC`
        );
      const dbProjects: (Project | ProjectCount)[] =
        await bestRatedQuery.execute();

      // Use type guard to filter and map projects
      const castedProjects = dbProjects.map((project) => {
        if (isProjectRating(project)) {
          return {
            ...project,
            averageRating: Number(project.averageRating),
          };
        }
        return project;
      }) as ProjectCount[];

      // Enhanced logging
      console.log("Raw database response:", castedProjects);
      console.log(`Number of projects returned: ${castedProjects.length}`);
      castedProjects.forEach((project, index) => {
        console.log(`Project ${index + 1}:`, project);
      });
      return castedProjects;
    }

    // If no specific filter is provided, return all projects
    const allProjectsQuery = db.select().from(projects);
    const dbProjects: Project[] = await allProjectsQuery.execute();
    console.log("DB Projects", dbProjects);
    return dbProjects;
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

export const getContributionAttestationList = async (contribution: string) => {
  try {
    const contributionAttestationsList = await db
      .select({
        id: contributionattestations.id,
        username: users.username,
        feedback: contributionattestations.feedback,
        attestationUID: contributionattestations.attestationUID,
        createdAt: contributionattestations.createdAt,
      })
      .from(contributionattestations)
      .innerJoin(users, eq(contributionattestations.userFid, users.fid))
      .where(eq(contributionattestations.contribution, contribution))
      .orderBy(desc(contributionattestations.createdAt))
      .limit(3);

    return contributionAttestationsList;
  } catch (error) {
    console.error("Error fetching attestation count:", error);
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
//gets the attestations a user has made to different contributions
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

//gets the projects a user has made
export const getProjectsByUserId = async (userFid: string) => {
  try {
    const userprojects = await db
      .select()
      .from(projects)
      .where(eq(projects.userFid, userFid))
      .execute();
    return userprojects;
  } catch (error) {
    console.error(`Error retrieving projects for user '${userFid}':`, error);
    throw error;
  }
};

//gets the attestations for each project a user has made
//include contributionattestation attestations for project name
//the prop will be the project name array from the user projects
export const getUserProjectAttestations = async (
  userProjectNames: string[]
) => {
  try {
    const userprojectsattestations = await db
      .select()
      .from(contributionattestations)
      .where(inArray(contributionattestations.projectName, userProjectNames))
      .execute();
    return userprojectsattestations;
  } catch (error) {
    console.error(
      `Error retrieving projects for user '${userProjectNames.join(",")}':`,
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

export const fetchAttestationsWithLogos = async (
  userFid: string
): Promise<Attestation[]> => {
  const attestationsWithLogos = await db
    .select({
      id: contributionattestations.id,
      userFid: contributionattestations.userFid,
      projectName: contributionattestations.projectName,
      contribution: contributionattestations.contribution,
      ecosystem: contributionattestations.ecosystem,
      attestationUID: contributionattestations.attestationUID,
      attesterAddy: contributionattestations.attesterAddy,
      rating: contributionattestations.rating,
      improvementareas: contributionattestations.improvementareas,
      isdelegate: contributionattestations.isdelegate,
      feedback: contributionattestations.feedback,
      extrafeedback: contributionattestations.extrafeedback,
      createdAt: contributionattestations.createdAt,
      logoUrl: projects.logoUrl,
    })
    .from(contributionattestations)
    .leftJoin(
      projects,
      eq(contributionattestations.projectName, projects.projectName)
    )
    .where(eq(contributionattestations.userFid, userFid));

  return attestationsWithLogos;
};

//sorting projects by their ecosystem

export const getProjectsByEcosystem = async (
  ecosystem: string,
  endpoint: string,
  filter: string,
  sortOrder: string
): Promise<Project[]> => {
  try {
    let query = db.select().from(projects);

    // Filtering by ecosystem
    if (filter === "Projects on Optimism") {
      query = query.where(eq(projects.ecosystem, "Optimism")) as typeof query;
    } else if (filter === "Projects on Base") {
      query = query.where(eq(projects.ecosystem, "Base")) as typeof query;
    }

    // Sorting logic
    if (sortOrder === "asc") {
      query = query.orderBy(sql`${projects.projectName} ASC`) as typeof query;
    } else if (sortOrder === "desc") {
      query = query.orderBy(sql`${projects.projectName} DESC`) as typeof query;
    }

    const dbProjectsEcosystem: Project[] = await query.execute();
    console.log("DB Projects Ecosystem", dbProjectsEcosystem);

    return dbProjectsEcosystem;
  } catch (error) {
    console.error(`Error retrieving projects for ecosystem:`, error);
    throw error;
  }
};

export const getUserPfp = async (userFid: string) => {
  try {
    const userPfp = await db
      .select({
        pfpUrl: users.pfp_url,
      })
      .from(users)
      .where(eq(users.fid, userFid))
      .limit(1);

    if (userPfp.length === 0) {
      return null;
    }

    return userPfp[0];
  } catch (error) {
    console.error(`Error retrieving user pfp for '${userFid}':`, error);
    throw error;
  }
};
