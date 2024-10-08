"use server";

import { getAttestationsByUserId } from "@/src/lib/db/dbattestations";


export const getUserAttestations = async (fid: string) => {
  const attestations = await getAttestationsByUserId(fid);

  return  attestations
}