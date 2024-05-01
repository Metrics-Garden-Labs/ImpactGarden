import { getAttestationCountByProject } from "../../../src/lib/db";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    console.log("Received request to get attestation count");

    const { project } = await request.json();
    console.log("Project:", project);

    const response = await getAttestationCountByProject(project);
    console.log("Attestation count:", response);

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error("Error fetching attestation count:", error);
    return NextResponse.json(
      { error: "Failed to fetch attestation count" },
      { status: 500 }
    );
  }
};
