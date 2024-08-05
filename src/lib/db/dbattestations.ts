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
  NewContributionAttestationGov,
  Attestation2,
  Attestation3,
  ProjectAttestations,
} from "@/src/types";
import { count } from "console";
import { desc, sql as drizzlesql } from "drizzle-orm";
import { inArray, eq, sql } from "drizzle-orm";
import { string } from "zod";

export const db = drizzle(vercelsql, { schema });

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
        pfp: users.pfp_url,
        feedback: contributionattestations.feedback,
        rating: contributionattestations.rating,
        attestationUID: contributionattestations.attestationUID,
        createdAt: contributionattestations.createdAt,
      })
      .from(contributionattestations)
      .innerJoin(users, eq(contributionattestations.userFid, users.fid))
      .where(eq(contributionattestations.contribution, contribution))
      .orderBy(desc(contributionattestations.createdAt));

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
// export const getAttestationsByUserId = async (userFid: string) => {
//   try {
//     const attestations = await db
//       .select()
//       .from(contributionattestations)
//       .where(eq(contributionattestations.userFid, userFid))
//       .execute();
//     return attestations;
//   } catch (error) {
//     console.error(
//       `Error retrieving attestations for user '${userFid}':`,
//       error
//     );
//     throw error;
//   }
// };
// src/lib/db.ts
// src/lib/db.ts
export const getAttestationsByUserId = async (
  userFid: string
): Promise<Attestation2[]> => {
  try {
    const contributionAttestations = await db
      .select()
      .from(contributionattestations)
      .where(eq(contributionattestations.userFid, userFid))
      .execute();

    const infraToolingAttestations = await db
      .select()
      .from(governance_infra_and_tooling)
      .where(eq(governance_infra_and_tooling.userfid, userFid))
      .execute();

    const rAndAAttestations = await db
      .select()
      .from(governance_r_and_a)
      .where(eq(governance_r_and_a.userfid, userFid))
      .execute();

    const collabOnboardingAttestations = await db
      .select()
      .from(governance_collab_and_onboarding)
      .where(eq(governance_collab_and_onboarding.userfid, userFid))
      .execute();

    // Normalize the data to fit Attestation2 interface
    const normalizeAttestation = (att: any): Attestation2 => ({
      id: att.id,
      userFid: att.userFid || att.userfid,
      projectName: att.projectName,
      contribution: att.contribution,
      ecosystem: att.ecosystem,
      attestationUID: att.attestationUID,
      attesterAddy: att.attesterAddy,
      feedback: att.feedback || att.explanation,
      isdelegate: att.isdelegate,
      rating: att.rating,
      improvementareas: att.improvementareas,
      extrafeedback: att.extrafeedback,
      category: att.category,
      subcategory: att.subcategory,
      createdAt: att.createdAt,
      logoUrl: att.logoUrl,
      likely_to_recommend: att.likely_to_recommend,
      feeling_if_didnt_exist: att.feeling_if_didnt_exist,
      useful_for_understanding: att.useful_for_understanding,
      effective_for_improvements: att.effective_for_improvements,
      governance_knowledge: att.governance_knowledge,
      recommend_contribution: att.recommend_contribution,
    });

    // Combine and normalize all attestations
    const allAttestations: Attestation2[] = [
      ...contributionAttestations.map(normalizeAttestation),
      ...infraToolingAttestations.map(normalizeAttestation),
      ...rAndAAttestations.map(normalizeAttestation),
      ...collabOnboardingAttestations.map(normalizeAttestation),
    ];

    return allAttestations;
  } catch (error) {
    console.error(
      `Error retrieving attestations for user '${userFid}':`,
      error
    );
    throw error;
  }
};
//user attestations
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

export const fetchGovernanceAttestationsWithLogos = async (
  userFid: string
): Promise<Attestation2[]> => {
  const infraToolingAttestations = await db
    .select({
      id: governance_infra_and_tooling.id,
      userFid: governance_infra_and_tooling.userfid,
      projectName: governance_infra_and_tooling.projectName,
      contribution: governance_infra_and_tooling.contribution,
      ecosystem: governance_infra_and_tooling.ecosystem,
      attestationUID: governance_infra_and_tooling.attestationUID,
      category: governance_infra_and_tooling.category,
      subcategory: governance_infra_and_tooling.subcategory,
      feedback: governance_infra_and_tooling.explanation,
      createdAt: governance_infra_and_tooling.createdAt,
      logoUrl: projects.logoUrl,
      likely_to_recommend: governance_infra_and_tooling.likely_to_recommend,
      feeling_if_didnt_exist:
        governance_infra_and_tooling.feeling_if_didnt_exist,
    })
    .from(governance_infra_and_tooling)
    .leftJoin(
      projects,
      eq(governance_infra_and_tooling.projectName, projects.projectName)
    )
    .where(eq(governance_infra_and_tooling.userfid, userFid));

  const rAndAAttestations = await db
    .select({
      id: governance_r_and_a.id,
      userFid: governance_r_and_a.userfid,
      projectName: governance_r_and_a.projectName,
      contribution: governance_r_and_a.contribution,
      ecosystem: governance_r_and_a.ecosystem,
      attestationUID: governance_r_and_a.attestationUID,
      category: governance_r_and_a.category,
      subcategory: governance_r_and_a.subcategory,
      feedback: governance_r_and_a.explanation,
      createdAt: governance_r_and_a.createdAt,
      logoUrl: projects.logoUrl,
      likely_to_recommend: governance_r_and_a.likely_to_recommend,
      useful_for_understanding: governance_r_and_a.useful_for_understanding,
      effective_for_improvements: governance_r_and_a.effective_for_improvements,
    })
    .from(governance_r_and_a)
    .leftJoin(
      projects,
      eq(governance_r_and_a.projectName, projects.projectName)
    )
    .where(eq(governance_r_and_a.userfid, userFid));

  const collabOnboardingAttestations = await db
    .select({
      id: governance_collab_and_onboarding.id,
      userFid: governance_collab_and_onboarding.userfid,
      projectName: governance_collab_and_onboarding.projectName,
      contribution: governance_collab_and_onboarding.contribution,
      ecosystem: governance_collab_and_onboarding.ecosystem,
      attestationUID: governance_collab_and_onboarding.attestationUID,
      category: governance_collab_and_onboarding.category,
      subcategory: governance_collab_and_onboarding.subcategory,
      feedback: governance_collab_and_onboarding.explanation,
      createdAt: governance_collab_and_onboarding.createdAt,
      logoUrl: projects.logoUrl,
      governance_knowledge:
        governance_collab_and_onboarding.governance_knowledge,
      recommend_contribution:
        governance_collab_and_onboarding.recommend_contribution,
      feeling_if_didnt_exist:
        governance_collab_and_onboarding.feeling_if_didnt_exist,
    })
    .from(governance_collab_and_onboarding)
    .leftJoin(
      projects,
      eq(governance_collab_and_onboarding.projectName, projects.projectName)
    )
    .where(eq(governance_collab_and_onboarding.userfid, userFid));

  const transformAttestations = (attestations: any[]): Attestation2[] =>
    attestations.map((att) => ({
      ...att,
      likely_to_recommend: att.likely_to_recommend ?? undefined,
      feeling_if_didnt_exist: att.feeling_if_didnt_exist ?? undefined,
      useful_for_understanding: att.useful_for_understanding ?? undefined,
      effective_for_improvements: att.effective_for_improvements ?? undefined,
      governance_knowledge: att.governance_knowledge ?? undefined,
      recommend_contribution: att.recommend_contribution ?? undefined,
    }));

  return [
    ...transformAttestations(infraToolingAttestations),
    ...transformAttestations(rAndAAttestations),
    ...transformAttestations(collabOnboardingAttestations),
  ];
};

export const fetchAllAttestationsWithLogos = async (
  userFid: string
): Promise<Attestation2[]> => {
  try {
    // Fetch attestations from the contributionattestations table
    const contributionAttestations = await fetchAttestationsWithLogos(userFid);

    // Fetch attestations from governance-related tables
    const governanceAttestations = await fetchGovernanceAttestationsWithLogos(
      userFid
    );

    // Ensure that the contributionAttestations match the Attestation2 type
    const formattedContributionAttestations: Attestation2[] =
      contributionAttestations.map((att) => ({
        ...att,
        category: undefined,
        subcategory: undefined,
        likely_to_recommend: undefined,
        feeling_if_didnt_exist: undefined,
        useful_for_understanding: undefined,
        effective_for_improvements: undefined,
        governance_knowledge: undefined,
        recommend_contribution: undefined,
      }));

    // Combine and return all attestations
    return [...formattedContributionAttestations, ...governanceAttestations];
  } catch (error) {
    console.error("Error fetching all attestations:", error);
    throw error;
  }
};
/////////////////
export const insertGovernanceInfraToolingAttestation = async (
  attestation: NewContributionAttestationGov
) => {
  try {
    console.log(
      "Inserting Governance Infra & Tooling attestation into the database"
    );
    const result = await db
      .insert(governance_infra_and_tooling)
      .values(attestation)
      .returning();
    console.log("Governance Infra & Tooling attestation inserted successfully");
    return result;
  } catch (error) {
    console.error(
      "Error inserting Governance Infra & Tooling attestation:",
      error
    );
    throw error;
  }
};

export const insertGovernanceRandAAttestation = async (
  attestation: NewContributionAttestationGov
) => {
  try {
    console.log(
      "Inserting Governance Research & Analytics attestation into the database"
    );
    const result = await db
      .insert(governance_r_and_a)
      .values(attestation)
      .returning();
    console.log(
      "Governance Research & Analytics attestation inserted successfully"
    );
    return result;
  } catch (error) {
    console.error(
      "Error inserting Governance Research & Analytics attestation:",
      error
    );
    throw error;
  }
};

export const insertGovernanceCollabAndOnboardingAttestation = async (
  attestation: NewContributionAttestationGov
) => {
  try {
    console.log(
      "Inserting Governance Collaboration & Onboarding attestation into the database"
    );
    const result = await db
      .insert(governance_collab_and_onboarding)
      .values(attestation)
      .returning();
    console.log(
      "Governance Collaboration & Onboarding attestation inserted successfully"
    );
    return result;
  } catch (error) {
    console.error(
      "Error inserting Governance Collaboration & Onboarding attestation:",
      error
    );
    throw error;
  }
};

// for getting the attestations depending on the category and subcaegory

const subcategoryTableMap: { [key: string]: any } = {
  "Infra & Tooling": governance_infra_and_tooling,
  "Governance Research & Analytics": governance_r_and_a,
  "Collaboration & Onboarding": governance_collab_and_onboarding,
  //add the other categories here
};

export const getInfraToolingAttestationsByContribution = async (
  contribution: string
) => {
  try {
    const attestations = await db
      .select({
        id: governance_infra_and_tooling.id,
        userfid: governance_infra_and_tooling.userfid,
        username: users.username,
        pfp: users.pfp_url,
        projectName: governance_infra_and_tooling.projectName,
        category: governance_infra_and_tooling.category,
        subcategory: governance_infra_and_tooling.subcategory,
        ecosystem: governance_infra_and_tooling.ecosystem,
        attestationUID: governance_infra_and_tooling.attestationUID,
        likely_to_recommend: governance_infra_and_tooling.likely_to_recommend,
        feeling_if_didnt_exist:
          governance_infra_and_tooling.feeling_if_didnt_exist,
        explanation: governance_infra_and_tooling.explanation,
        private_feedback: governance_infra_and_tooling.private_feedback,
        createdAt: governance_infra_and_tooling.createdAt,
      })
      .from(governance_infra_and_tooling)
      .innerJoin(users, eq(governance_infra_and_tooling.userfid, users.fid))
      .where(eq(governance_infra_and_tooling.contribution, contribution))
      .orderBy(desc(governance_infra_and_tooling.createdAt));

    return attestations;
  } catch (error) {
    console.error("Error retrieving infra & tooling attestations:", error);
    throw error;
  }
};

export const getRandAAttestationsByContribution = async (
  contribution: string
) => {
  try {
    const attestations = await db
      .select({
        id: governance_r_and_a.id,
        userfid: governance_r_and_a.userfid,
        username: users.username,
        pfp: users.pfp_url,
        projectName: governance_r_and_a.projectName,
        category: governance_r_and_a.category,
        subcategory: governance_r_and_a.subcategory,
        ecosystem: governance_r_and_a.ecosystem,
        attestationUID: governance_r_and_a.attestationUID,
        likely_to_recommend: governance_r_and_a.likely_to_recommend,
        useful_for_understanding: governance_r_and_a.useful_for_understanding,
        effective_for_improvements:
          governance_r_and_a.effective_for_improvements,
        explanation: governance_r_and_a.explanation,
        private_feedback: governance_r_and_a.private_feedback,
        createdAt: governance_r_and_a.createdAt,
      })
      .from(governance_r_and_a)
      .innerJoin(users, eq(governance_r_and_a.userfid, users.fid))
      .where(eq(governance_r_and_a.contribution, contribution))
      .orderBy(desc(governance_r_and_a.createdAt));

    return attestations;
  } catch (error) {
    console.error("Error retrieving research & analytics attestations:", error);
    throw error;
  }
};

export const getCollabAndOnboardingAttestationsByContribution = async (
  contribution: string
) => {
  try {
    const attestations = await db
      .select({
        id: governance_collab_and_onboarding.id,
        userfid: governance_collab_and_onboarding.userfid,
        username: users.username,
        pfp: users.pfp_url,
        projectName: governance_collab_and_onboarding.projectName,
        category: governance_collab_and_onboarding.category,
        subcategory: governance_collab_and_onboarding.subcategory,
        ecosystem: governance_collab_and_onboarding.ecosystem,
        attestationUID: governance_collab_and_onboarding.attestationUID,
        governance_knowledge:
          governance_collab_and_onboarding.governance_knowledge,
        recommend_contribution:
          governance_collab_and_onboarding.recommend_contribution,
        feeling_if_didnt_exist:
          governance_collab_and_onboarding.feeling_if_didnt_exist,
        explanation: governance_collab_and_onboarding.explanation,
        private_feedback: governance_collab_and_onboarding.private_feedback,
        createdAt: governance_collab_and_onboarding.createdAt,
      })
      .from(governance_collab_and_onboarding)
      .innerJoin(users, eq(governance_collab_and_onboarding.userfid, users.fid))
      .where(eq(governance_collab_and_onboarding.contribution, contribution))
      .orderBy(desc(governance_collab_and_onboarding.createdAt));

    return attestations;
  } catch (error) {
    console.error(
      "Error retrieving collaboration & onboarding attestations:",
      error
    );
    throw error;
  }
};

export const getAttestationsByContributionAndSubcategory = async (
  contribution: string,
  subcategory: string | null
) => {
  try {
    if (!subcategory) {
      // If subcategory is null or an empty string, use the default table
      return await getContributionAttestationList(contribution);
    }

    switch (subcategory) {
      case "Infra & Tooling":
        return await getInfraToolingAttestationsByContribution(contribution);
      case "Governance Research & Analytics":
        return await getRandAAttestationsByContribution(contribution);
      case "Collaboration & Onboarding":
        return await getCollabAndOnboardingAttestationsByContribution(
          contribution
        );
      default:
        throw new Error(`Unsupported subcategory: ${subcategory}`);
    }
  } catch (error) {
    console.error("Error retrieving attestations:", error);
    throw error;
  }
};

export const getAttestationsByProject = async (projectName: string) => {
  try {
    const contributionAttestations = await db
      .select({
        id: contributionattestations.id,
        userFid: contributionattestations.userFid,
        username: users.username,
        pfp: users.pfp_url,
        projectName: contributionattestations.projectName,
        contribution: contributionattestations.contribution,
        ecosystem: contributionattestations.ecosystem,
        attestationUID: contributionattestations.attestationUID,
        feedback: contributionattestations.feedback,
        rating: contributionattestations.rating,
        improvementareas: contributionattestations.improvementareas,
        isdelegate: contributionattestations.isdelegate,
        extrafeedback: contributionattestations.extrafeedback,
        createdAt: contributionattestations.createdAt,
      })
      .from(contributionattestations)
      .innerJoin(users, eq(contributionattestations.userFid, users.fid))
      .where(eq(contributionattestations.projectName, projectName))
      .orderBy(desc(contributionattestations.createdAt));

    const infraToolingAttestations = await db
      .select({
        id: governance_infra_and_tooling.id,
        userFid: governance_infra_and_tooling.userfid,
        username: users.username,
        pfp: users.pfp_url,
        projectName: governance_infra_and_tooling.projectName,
        contribution: governance_infra_and_tooling.contribution,
        ecosystem: governance_infra_and_tooling.ecosystem,
        attestationUID: governance_infra_and_tooling.attestationUID,
        likely_to_recommend: governance_infra_and_tooling.likely_to_recommend,
        feeling_if_didnt_exist:
          governance_infra_and_tooling.feeling_if_didnt_exist,
        explanation: governance_infra_and_tooling.explanation,
        createdAt: governance_infra_and_tooling.createdAt,
      })
      .from(governance_infra_and_tooling)
      .innerJoin(users, eq(governance_infra_and_tooling.userfid, users.fid))
      .where(eq(governance_infra_and_tooling.projectName, projectName))
      .orderBy(desc(governance_infra_and_tooling.createdAt));

    const rAndAAttestations = await db
      .select({
        id: governance_r_and_a.id,
        userFid: governance_r_and_a.userfid,
        username: users.username,
        pfp: users.pfp_url,
        projectName: governance_r_and_a.projectName,
        contribution: governance_r_and_a.contribution,
        ecosystem: governance_r_and_a.ecosystem,
        attestationUID: governance_r_and_a.attestationUID,
        likely_to_recommend: governance_r_and_a.likely_to_recommend,
        useful_for_understanding: governance_r_and_a.useful_for_understanding,
        effective_for_improvements:
          governance_r_and_a.effective_for_improvements,
        explanation: governance_r_and_a.explanation,
        createdAt: governance_r_and_a.createdAt,
      })
      .from(governance_r_and_a)
      .innerJoin(users, eq(governance_r_and_a.userfid, users.fid))
      .where(eq(governance_r_and_a.projectName, projectName))
      .orderBy(desc(governance_r_and_a.createdAt));

    const collabOnboardingAttestations = await db
      .select({
        id: governance_collab_and_onboarding.id,
        userFid: governance_collab_and_onboarding.userfid,
        username: users.username,
        pfp: users.pfp_url,
        projectName: governance_collab_and_onboarding.projectName,
        contribution: governance_collab_and_onboarding.contribution,
        ecosystem: governance_collab_and_onboarding.ecosystem,
        attestationUID: governance_collab_and_onboarding.attestationUID,
        governance_knowledge:
          governance_collab_and_onboarding.governance_knowledge,
        recommend_contribution:
          governance_collab_and_onboarding.recommend_contribution,
        feeling_if_didnt_exist:
          governance_collab_and_onboarding.feeling_if_didnt_exist,
        explanation: governance_collab_and_onboarding.explanation,
        createdAt: governance_collab_and_onboarding.createdAt,
      })
      .from(governance_collab_and_onboarding)
      .innerJoin(users, eq(governance_collab_and_onboarding.userfid, users.fid))
      .where(eq(governance_collab_and_onboarding.projectName, projectName))
      .orderBy(desc(governance_collab_and_onboarding.createdAt));

    const normalizeAttestation = (att: any): ProjectAttestations => ({
      id: att.id,
      userFid: att.userFid || att.userfid,
      username: att.username,
      pfp: att.pfp,
      projectName: att.projectName,
      contribution: att.contribution,
      ecosystem: att.ecosystem,
      attestationUID: att.attestationUID,
      feedback: att.feedback || att.explanation,
      isdelegate: att.isdelegate,
      rating: att.rating,
      improvementareas: att.improvementareas,
      extrafeedback: att.extrafeedback,
      category: att.category,
      subcategory: att.subcategory,
      createdAt: att.createdAt,
      logoUrl: att.logoUrl,
      likely_to_recommend: att.likely_to_recommend,
      feeling_if_didnt_exist: att.feeling_if_didnt_exist,
      useful_for_understanding: att.useful_for_understanding,
      effective_for_improvements: att.effective_for_improvements,
      governance_knowledge: att.governance_knowledge,
      recommend_contribution: att.recommend_contribution,
    });

    const allAttestations: ProjectAttestations[] = [
      ...contributionAttestations.map(normalizeAttestation),
      ...infraToolingAttestations.map(normalizeAttestation),
      ...rAndAAttestations.map(normalizeAttestation),
      ...collabOnboardingAttestations.map(normalizeAttestation),
    ];

    return allAttestations;
  } catch (error) {
    console.error("Error retrieving attestations:", error);
    throw error;
  }
};
