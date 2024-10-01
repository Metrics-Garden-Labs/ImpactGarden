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
  onchain_builders,
  op_stack,
} from "../schema";
import * as schema from "../schema";
import { ContributionWithAttestationCount } from "@/src/types";
import { eq, sql, and, isNull, SQL } from "drizzle-orm";
import { alias, PgSelect } from "drizzle-orm/pg-core";

//this stores all the db queries related to contributions

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

export const getContributionsByCategory = async (category: string) => {
  try {
    // Query for paginated contributions
    const dbcontributions = await db
      .select({
        id: contributions.id,
        userFid: contributions.userFid,
        projectName: contributions.projectName,
        ecosystem: contributions.ecosystem,
        governancetype: contributions.governancetype,
        category: contributions.category,
        subcategory: contributions.subcategory,
        secondaryecosystem: contributions.secondaryecosystem,
        contribution: contributions.contribution,
        desc: contributions.desc,
        link: contributions.link,
        ethAddress: contributions.ethAddress,
        primarycontributionuid: contributions.primarycontributionuid,
        easUid: contributions.easUid,
        createdAt: contributions.createdAt,
        logoUrl: projects.logoUrl,
      })
      .from(contributions)
      .leftJoin(projects, eq(contributions.projectName, projects.projectName))
      .where(eq(contributions.category, category));

    // Query for total count
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(contributions)
      .where(eq(contributions.category, category));

    const totalCount = totalCountResult[0].count;

    return {
      contributions: dbcontributions,
      total: totalCount,
    };
  } catch (error) {
    console.error("Error retrieving contributions:", error);
    throw error;
  }
};

export const getUserReviews = async (userFid: string, category: string) => {
  try {
    let reviews;
    if (category === "Governance") {
      reviews = await db
        .select({ projectName: governance_infra_and_tooling.projectName })
        .from(governance_infra_and_tooling)
        .where(eq(governance_infra_and_tooling.userfid, userFid))
        .union(
          db
            .select({ projectName: governance_r_and_a.projectName })
            .from(governance_r_and_a)
            .where(eq(governance_r_and_a.userfid, userFid))
        )
        .union(
          db
            .select({
              projectName: governance_collab_and_onboarding.projectName,
            })
            .from(governance_collab_and_onboarding)
            .where(eq(governance_collab_and_onboarding.userfid, userFid))
        )
        .union(
          db
            .select({ projectName: governance_structures_op.projectName })
            .from(governance_structures_op)
            .where(eq(governance_structures_op.userfid, userFid))
        );
    } else if (category === "Onchain Builders") {
      reviews = await db
        .select({ projectName: onchain_builders.projectName })
        .from(onchain_builders)
        .where(eq(onchain_builders.userfid, userFid));
    } else if (category === "OP Stack") {
      reviews = await db
        .select({ projectName: op_stack.projectName })
        .from(op_stack)
        .where(eq(op_stack.userfid, userFid));
    } else {
      reviews = await db
        .select({ projectName: contributionattestations.projectName })
        .from(contributionattestations)
        .where(eq(contributionattestations.userFid, userFid));
    }
    return reviews;
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    throw error;
  }
};

//get the contribution by the id
export const getContributionByPrimaryContributionUid = async (
  primarycontributionuid: string
) => {
  try {
    const contribution = await db
      .select()
      .from(contributions)
      .where(eq(contributions.primarycontributionuid, primarycontributionuid))
      .limit(1);

    if (contribution.length === 0) {
      throw new Error(`Contribution not found: ${primarycontributionuid}`);
    }
    console.log("Contribution:", contribution[0]);

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

        const count6 = await db
          .select({ count: sql<number>`count(*)` })
          .from(onchain_builders)
          .where(
            and(
              eq(onchain_builders.projectName, contribution.projectName),
              eq(onchain_builders.contribution, contribution.contribution)
            )
          )
          .execute();

        const count7 = await db
          .select({ count: sql<number>`count(*)` })
          .from(op_stack)
          .where(
            and(
              eq(op_stack.projectName, contribution.projectName),
              eq(op_stack.contribution, contribution.contribution)
            )
          )
          .execute();

        const totalCount =
          Number(count1[0]?.count || 0) +
          Number(count2[0]?.count || 0) +
          Number(count3[0]?.count || 0) +
          Number(count4[0]?.count || 0) +
          Number(count5[0]?.count || 0) +
          Number(count6[0]?.count || 0) +
          Number(count7[0]?.count || 0);

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
        console.log(`Count from onchain_builders: ${count6[0]?.count || 0}`);
        console.log(`Count from op_stack: ${count7[0]?.count || 0}`);
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
