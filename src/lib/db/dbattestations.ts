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
