import { getAttestationsByProject } from "@/src/lib/db/dbattestations";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { projectName } = await request.json();
    console.log(`Received request to get attestation count for ${projectName}`);

    const attestations = await getAttestationsByProject(projectName);
    console.log("Project Attestations", attestations);

    return NextResponse.json({ attestations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching attestation count:", error);
    return NextResponse.json(
      { error: "Failed to fetch attestation count" },
      { status: 500 }
    );
  }
};
