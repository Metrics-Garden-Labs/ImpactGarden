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
  governance_collab_and_onboarding,
  governance_infra_and_tooling,
  governance_r_and_a,
  governance_structures_op,
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
  ContributionWithAttestationCount,
} from "@/src/types";
import { count } from "console";
import { desc, sql as drizzlesql } from "drizzle-orm";
import { inArray, eq, sql, and } from "drizzle-orm";

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
    console.error("Error retrieving contribution:", error);
    throw error;
  }
};

export const getContributionsWithAttestationCounts = async (
  projectName: string,
  contributionName?: string
): Promise<ContributionWithAttestationCount[]> => {
  try {
    const baseCondition = eq(contributions.projectName, projectName);
    const condition = contributionName
      ? and(baseCondition, eq(contributions.contribution, contributionName))
      : baseCondition;

    const contributionsData = await db
      .select()
      .from(contributions)
      .where(condition)
      .execute();

    const results = await Promise.all(
      contributionsData.map(async (contribution) => {
        const count1 = await db
          .select({ count: sql<number>`count(*)` })
          .from(contributionattestations)
          .where(
            and(
              eq(
                contributionattestations.projectName,
                contribution.projectName
              ),
              eq(
                contributionattestations.contribution,
                contribution.contribution
              )
            )
          )
          .execute();

        const count2 = await db
          .select({ count: sql<number>`count(*)` })
          .from(governance_infra_and_tooling)
          .where(
            and(
              eq(
                governance_infra_and_tooling.projectName,
                contribution.projectName
              ),
              eq(
                governance_infra_and_tooling.contribution,
                contribution.contribution
              )
            )
          )
          .execute();

        const count3 = await db
          .select({ count: sql<number>`count(*)` })
          .from(governance_r_and_a)
          .where(
            and(
              eq(governance_r_and_a.projectName, contribution.projectName),
              eq(governance_r_and_a.contribution, contribution.contribution)
            )
          )
          .execute();

        const count4 = await db
          .select({ count: sql<number>`count(*)` })
          .from(governance_collab_and_onboarding)
          .where(
            and(
              eq(
                governance_collab_and_onboarding.projectName,
                contribution.projectName
              ),
              eq(
                governance_collab_and_onboarding.contribution,
                contribution.contribution
              )
            )
          )
          .execute();

        const count5 = await db
          .select({ count: sql<number>`count(*)` })
          .from(governance_structures_op)
          .where(
            and(
              eq(
                governance_structures_op.projectName,
                contribution.projectName
              ),
              eq(
                governance_structures_op.contribution,
                contribution.contribution
              )
            )
          )
          .execute();

        const totalCount =
          Number(count1[0]?.count || 0) +
          Number(count2[0]?.count || 0) +
          Number(count3[0]?.count || 0) +
          Number(count4[0]?.count || 0);
        Number(count5[0]?.count || 0);

        console.log(`Contribution: ${contribution.contribution}`);
        console.log(
          `Count from contributionattestations: ${count1[0]?.count || 0}`
        );
        console.log(
          `Count from governance_infra_and_tooling: ${count2[0]?.count || 0}`
        );
        console.log(`Count from governance_r_and_a: ${count3[0]?.count || 0}`);
        console.log(
          `Count from governance_collab_and_onboarding: ${
            count4[0]?.count || 0
          }`
        );
        console.log(
          `Count from governance_structures_op: ${count5[0]?.count || 0}`
        );
        console.log(`Total count: ${totalCount}`);

        return {
          ...contribution,
          attestationCount: Number(totalCount),
        };
      })
    );

    return results;
  } catch (error) {
    console.error(
      "Error retrieving contributions with attestation counts:",
      error
    );
    throw error;
  }
};
