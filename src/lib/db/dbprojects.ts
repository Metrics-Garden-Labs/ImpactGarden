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
} from "@/src/types";
import { inArray, eq, sql } from "drizzle-orm";

export const db = drizzle(vercelsql, { schema });

const isProjectCount = (project: any): project is ProjectCount => {
  return "attestationCount" in project;
};

const isProjectRating = (project: any): project is ProjectCount => {
  return "averageRating" in project;
};

export const getProjects = async (filter: string = "") => {
  try {
    console.log("Filter db", filter);
    let dbProjects: (Project | ProjectCount)[] = [];

    if (filter === "Recently Added") {
      const recentlyAddedQuery = db
        .select()
        .from(projects)
        .orderBy(sql`${projects.createdAt} DESC`);
      dbProjects = await recentlyAddedQuery.execute();
    } else if (filter === "Projects on Optimism") {
      const optimismQuery = db
        .select()
        .from(projects)
        .where(sql`${projects.ecosystem} = 'Optimism'`);
      dbProjects = await optimismQuery.execute();
    } else if (filter === "Most Attested") {
      const attestedQuery = db
        .select({
          id: projects.id,
          userFid: projects.userFid,
          ethAddress: projects.ethAddress,
          ecosystem: projects.ecosystem,
          projectName: projects.projectName,
          oneliner: projects.oneliner,
          category: projects.category,
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
          projects.category,
          projects.websiteUrl,
          projects.twitterUrl,
          projects.githubUrl,
          projects.logoUrl,
          projects.projectUid,
          projects.createdAt
        )
        .orderBy(sql`COUNT(${contributionattestations.id}) DESC`);
      dbProjects = await attestedQuery.execute();

      // Use type guard to filter and map projects
      dbProjects = dbProjects.map((project) => {
        if (isProjectCount(project)) {
          return {
            ...project,
            attestationCount: Number(project.attestationCount),
          };
        }
        return project;
      });
    } else if (filter === "Best Rated") {
      const bestRatedQuery = db
        .select({
          id: projects.id,
          userFid: projects.userFid,
          ethAddress: projects.ethAddress,
          ecosystem: projects.ecosystem,
          projectName: projects.projectName,
          oneliner: projects.oneliner,
          category: projects.category,
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
      dbProjects = await bestRatedQuery.execute();

      // Use type guard to filter and map projects
      dbProjects = dbProjects.map((project) => {
        if (isProjectRating(project)) {
          return {
            ...project,
            averageRating:
              project.averageRating !== null
                ? Number(project.averageRating)
                : null,
          };
        }
        return project;
      });
    } else {
      const allProjectsQuery = db.select().from(projects);
      dbProjects = await allProjectsQuery.execute();
    }

    // Enhanced logging
    console.log("Raw database response:", dbProjects);
    console.log(`Number of projects returned: ${dbProjects.length}`);
    dbProjects.forEach((project, index) => {
      console.log(`Project ${index + 1}:`, project);
    });
    return dbProjects;
  } catch (error) {
    console.error("Error retrieving projects:", error);
    throw error;
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
