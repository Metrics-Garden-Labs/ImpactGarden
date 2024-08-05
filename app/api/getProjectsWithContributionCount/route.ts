// app/api/getProjectsWithContributionCount/route.ts

import { NextResponse } from "next/server";
import { getContributionsWithAttestationCounts } from "@/src/lib/db/dbcontributions";

export const POST = async (request: Request) => {
  try {
    console.log("Received request to get project with contribution count");

    const { projectName, contribution } = await request.json();
    console.log(`Project Name: ${projectName}`);

    const contributions = await getContributionsWithAttestationCounts(
      projectName,
      contribution
    );

    console.log("Contributions with attestation counts:", contributions);

    return NextResponse.json({ contributions }, { status: 200 });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
};
