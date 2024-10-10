"use server";

import { getAttestationsByUserId } from "@/src/lib/db/dbattestations";
import { getContributionsByProjectName } from "@/src/lib/db/dbcontributions";

export const getUserAttestations = async (fid: string) => {
  const attestations = await getAttestationsByUserId(fid);

  return attestations;
};

export const getContributionsForProjectName = async (projectName: string) => {
  const attestations = await getContributionsByProjectName(projectName);
  return attestations;
};
