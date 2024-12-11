import "../config";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql as vercelsql } from "@vercel/postgres";
import {
  users,
  projects,
  contributions,
  contributionattestations,
  user_addresses,
  op_delegates,
  governance_infra_and_tooling,
  governance_r_and_a,
  governance_collab_and_onboarding,
  governance_structures_op,
  onchain_builders,
  op_stack,
} from "../schema";
import * as schema from "../schema";
import {
  Project,
  newUserAddresses,
  Attestation,
  ProjectCount,
  Contribution,
  NewProject,
  CategoryData,
  ProjectWithAttestationCount,
  ContributionWithProjectsAndAttestationCount,
} from "@/src/types";
import { inArray, eq, sql, and, SQL } from "drizzle-orm";
import { PgSelect } from "drizzle-orm/pg-core";

//this stores all the db queries related to projects

export const db = drizzle(vercelsql, { schema });

const isProjectCount = (project: any): project is ProjectCount => {
  return "attestationCount" in project;
};

const isProjectRating = (project: any): project is ProjectCount => {
  return "averageRating" in project;
};

export const getProjectsByCategoryAndSubcategory = async (
  category: string,
  subcategory: string
): Promise<Project[]> => {
  try {
    let query;

    if (category?.trim() && subcategory?.trim()) {
      // Query to filter projects by both category and subcategory
      const subquery = db
        .select({ projectName: contributions.projectName })
        .from(contributions)
        .where(
          and(
            eq(contributions.category, category),
            eq(contributions.subcategory, subcategory)
          )
        )
        .groupBy(contributions.projectName);

      query = db
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
          primaryprojectuid: projects.primaryprojectuid,
          projectUid: projects.projectUid,
          createdAt: projects.createdAt,
        })
        .from(projects)
        .where(inArray(projects.projectName, subquery));
    } else if (category?.trim()) {
      // Query to filter projects by category only
      const subquery = db
        .select({ projectName: contributions.projectName })
        .from(contributions)
        .where(eq(contributions.category, category))
        .groupBy(contributions.projectName);

      query = db
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
          primaryprojectuid: projects.primaryprojectuid,
          projectUid: projects.projectUid,
          createdAt: projects.createdAt,
        })
        .from(projects)
        .where(inArray(projects.projectName, subquery));
    } else {
      // Fallback if no category or subcategory is provided
      query = db
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
          primaryprojectuid: projects.primaryprojectuid,
          projectUid: projects.projectUid,
          createdAt: projects.createdAt,
        })
        .from(projects);
    }

    const dbProjects = await query.execute();

    console.log("Fetched projects:", dbProjects);
    return dbProjects;
  } catch (error) {
    console.error(
      "Error retrieving projects by category and subcategory:",
      error
    );
    throw error;
  }
};

export const getContributionsByCategoryAndSubcategory = async (
  category: string,
  subcategory: string,
  sortOrder: string
): Promise<ContributionWithProjectsAndAttestationCount[]> => {
  try {
    let query;
    if (category && subcategory) {
      console.log(
        `Filtering by category: ${category} and subcategory: ${subcategory}`
      );
      query = db
        .select({
          id: contributions.id,
          userFid: contributions.userFid,
          ethAddress: contributions.ethAddress,
          ecosystem: contributions.ecosystem,
          projectName: contributions.projectName,
          contribution: contributions.contribution,
          description: contributions.desc,
          category: contributions.category,
          subcategory: contributions.subcategory,
          governancetype: contributions.governancetype,
          secondaryecosystem: contributions.secondaryecosystem,
          link: contributions.link,
          primarycontributionuid: contributions.primarycontributionuid,
          easUid: contributions.easUid,
          createdAt: contributions.createdAt,
          projectUid: projects.projectUid,
          primaryprojectuid: projects.primaryprojectuid,
          projectLogoUrl: projects.logoUrl,
        })
        .from(contributions)
        .leftJoin(projects, eq(contributions.projectName, projects.projectName))
        .where(
          and(
            eq(contributions.category, category),
            eq(contributions.subcategory, subcategory)
          )
        );
    } else if (category) {
      console.log(`Filtering by category: ${category}`);
      query = db
        .select({
          id: contributions.id,
          userFid: contributions.userFid,
          ethAddress: contributions.ethAddress,
          ecosystem: contributions.ecosystem,
          projectName: contributions.projectName,
          description: contributions.desc,
          contribution: contributions.contribution,
          category: contributions.category,
          subcategory: contributions.subcategory,
          governancetype: contributions.governancetype,
          secondaryecosystem: contributions.secondaryecosystem,
          link: contributions.link,
          primarycontributionuid: contributions.primarycontributionuid,
          easUid: contributions.easUid,
          createdAt: contributions.createdAt,
          projectUid: projects.projectUid,
          primaryprojectuid: projects.primaryprojectuid,
          projectLogoUrl: projects.logoUrl,
        })
        .from(contributions)
        .leftJoin(projects, eq(projects.projectName, contributions.projectName))
        .where(eq(contributions.category, category));
    } else {
      console.log(
        "No category or subcategory provided. Fetching all projects."
      );
      query = db
        .select({
          id: contributions.id,
          userFid: contributions.userFid,
          ethAddress: contributions.ethAddress,
          ecosystem: contributions.ecosystem,
          projectName: contributions.projectName,
          description: contributions.desc,
          contribution: contributions.contribution,
          category: contributions.category,
          subcategory: contributions.subcategory,
          governancetype: contributions.governancetype,
          secondaryecosystem: contributions.secondaryecosystem,
          link: contributions.link,
          primarycontributionuid: contributions.primarycontributionuid,
          easUid: contributions.easUid,
          createdAt: contributions.createdAt,
          projectUid: projects.projectUid,
          primaryprojectuid: projects.primaryprojectuid,
          projectLogoUrl: projects.logoUrl,
        })
        .from(contributions)
		.leftJoin(projects, eq(projects.projectName, contributions.projectName));
    }

    // Step 2: Apply Sorting (if requested)
    if (sortOrder === "Most Attested") {
      console.log("Sorting by Most Attested");
      query = query
        .leftJoin(
          contributionattestations,
          sql`${contributions.projectName} = ${contributionattestations.projectName}`
        )
        .leftJoin(
          governance_infra_and_tooling,
          sql`${contributions.projectName} = ${governance_infra_and_tooling.projectName}`
        )
        .leftJoin(
          governance_r_and_a,
          sql`${contributions.projectName} = ${governance_r_and_a.projectName}`
        )
        .leftJoin(
          governance_collab_and_onboarding,
          sql`${contributions.projectName} = ${governance_collab_and_onboarding.projectName}`
        )
        .leftJoin(
          governance_structures_op,
          sql`${contributions.projectName} = ${governance_structures_op.projectName}`
        )
        .leftJoin(
          onchain_builders,
          sql`${contributions.projectName} = ${onchain_builders.projectName}`
        )
        .leftJoin(
          op_stack,
          sql`${contributions.projectName} = ${op_stack.projectName}`
        )
        .groupBy(
          contributions.id,
          contributions.userFid,
          contributions.ethAddress,
          contributions.ecosystem,
          contributions.projectName,
          contributions.contribution,
          contributions.desc,
          contributions.category,
          contributions.subcategory,
          contributions.governancetype,
          contributions.secondaryecosystem,
          contributions.link,
          contributions.primarycontributionuid,
          contributions.easUid,
          contributions.createdAt,
          projects.logoUrl,
          projects.projectUid,
          projects.primaryprojectuid
        ).orderBy(sql`COALESCE(
              COUNT(${contributionattestations.id}) +
              COUNT(${governance_infra_and_tooling.id}) +
              COUNT(${governance_r_and_a.id}) +
              COUNT(${governance_collab_and_onboarding.id}) +
              COUNT(${governance_structures_op.id}) +
              COUNT(${onchain_builders.id}) +
              COUNT(${op_stack.id}),
              0
            ) DESC`);

      console.log("most attested", query);
    } else if (sortOrder === "Recently Added") {
      console.log("Sorting by Recently Added");
      query = query.orderBy(sql`${projects.createdAt} DESC`);
    } else if (sortOrder === "A-Z" || sortOrder === "Z-A") {
      console.log(`Sorting by ${sortOrder}`);
      query = query.orderBy(
        sortOrder === "Z-A"
          ? sql`${projects.projectName} DESC`
          : sql`${projects.projectName} ASC`
      );
    } else {
      console.log("No sorting applied. Returning unsorted results.");
    }

    console.log("Executing query:", query.toSQL());
    const result = await query.execute();
    console.log("Query result (first 5 items):", result.slice(0, 5));

    return result as unknown as ContributionWithProjectsAndAttestationCount[];
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

//get the categories for the project
export const ProjectCategories = async (
  projectName: string
): Promise<CategoryData> => {
  try {
    const results = await db
      .select({
        category: contributions.category,
        subcategory: contributions.subcategory,
      })
      .from(contributions)
      .innerJoin(projects, eq(contributions.projectName, projects.projectName))
      .where(eq(projects.projectName, projectName))
      .groupBy(contributions.category, contributions.subcategory)
      .execute();

    const categories = [
      ...new Set(
        results
          .map((r) => r.category)
          .filter((category): category is string => category !== null)
      ),
    ];
    const subcategories = [
      ...new Set(
        results
          .map((r) => r.subcategory)
          .filter((subcategory): subcategory is string => subcategory !== null)
      ),
    ];

    return { categories, subcategories };
  } catch (error) {
    console.error(`Error retrieving categories for project:`, error);
    return { categories: [], subcategories: [] };
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

export const getProjectAttestationCount = async (
  projectName: string
): Promise<number> => {
  try {
    const result = await db
      .select({
        totalCount: sql<number>`(
          COALESCE(COUNT(${contributionattestations.id}), 0) +
          COALESCE(COUNT(${governance_infra_and_tooling.id}), 0) +
          COALESCE(COUNT(${governance_r_and_a.id}), 0) +
          COALESCE(COUNT(${governance_collab_and_onboarding.id}), 0) +
          COALESCE(COUNT(${governance_structures_op.id}), 0) +
          COALESCE(COUNT(${onchain_builders.id}), 0) +
          COALESCE(COUNT(${op_stack.id}), 0)
        )`.as("totalCount"),
      })
      .from(projects)
      .leftJoin(
        contributionattestations,
        sql`${projects.projectName} = ${contributionattestations.projectName}`
      )
      .leftJoin(
        governance_infra_and_tooling,
        sql`${projects.projectName} = ${governance_infra_and_tooling.projectName}`
      )
      .leftJoin(
        governance_r_and_a,
        sql`${projects.projectName} = ${governance_r_and_a.projectName}`
      )
      .leftJoin(
        governance_collab_and_onboarding,
        sql`${projects.projectName} = ${governance_collab_and_onboarding.projectName}`
      )
      .leftJoin(
        governance_structures_op,
        sql`${projects.projectName} = ${governance_structures_op.projectName}`
      )
      .leftJoin(
        onchain_builders,
        sql`${projects.projectName} = ${onchain_builders.projectName}`
      )
      .leftJoin(
        op_stack,
        sql`${projects.projectName} = ${op_stack.projectName}`
      )
      .where(eq(projects.projectName, projectName))
      .groupBy(projects.id)
      .execute();

    const totalCount = result[0]?.totalCount || 0;

    console.log(`Total attestation count for ${projectName}: ${totalCount}`);

    return totalCount;
  } catch (error) {
    console.error(
      `Error retrieving attestation count for project '${projectName}':`,
      error
    );
    throw error;
  }
};

export const getProjectByPrimaryProjectUid = async (
  primaryProjectUid: string
) => {
  try {
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.primaryprojectuid, primaryProjectUid))
      .limit(1);

    if (project.length === 0) {
      throw new Error(`Project not found: ${primaryProjectUid}`);
    }

    return project[0].projectName;
  } catch (error) {
    console.error(`Error retrieving project by primary project uid:`, error);
    throw error;
  }
};

export const getPrimaryProjectUidByProjectName = async (
  projectName: string
) => {
  try {
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.projectName, projectName))
      .limit(1);

    if (project.length === 0) {
      throw new Error(`Project not found: ${projectName}`);
    }

    return project[0].primaryprojectuid;
  } catch (error) {
    console.error(`Error retrieving primary project uid for project:`, error);
    throw error;
  }
};
