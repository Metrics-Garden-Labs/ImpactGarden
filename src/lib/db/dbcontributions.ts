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
import { getAttestationsByAttester } from "../eas";
import { Waterfall } from "next/font/google";
import {
  Project,
  newUserAddresses,
  Attestation,
  ProjectCount,
  Contribution,
  NewProject,
} from "@/src/types";
import { count } from "console";
import { desc, sql as drizzlesql } from "drizzle-orm";
import { inArray, eq, sql } from "drizzle-orm";

export const db = drizzle(vercelsql, { schema });

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

//get the contribution by the id
export const getContributionById = async (contributionId: number) => {
  try {
    const contribution = await db
      .select()
      .from(contributions)
      .where(eq(contributions.id, contributionId))
      .limit(1);

    if (contribution.length === 0) {
      throw new Error(`Contribution not found: ${contributionId}`);
    }

    return contribution[0];
  } catch (error) {
    console.error(`Error retrieving contribution '${contributionId}':`, error);
    throw error;
  }
};
