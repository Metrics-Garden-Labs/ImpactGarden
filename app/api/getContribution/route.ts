import { NextResponse } from "next/server";
import { getContributionByPrimaryContributionUid } from "../../../src/lib/db/dbcontributions";
import { getProjectByName } from "../../../src/lib/db/dbprojects";

export async function POST(request: Request) {
  try {
    console.log("Incoming request:", request.url);
    const body = await request.json();
    const id = body.id;

    if (!id) {
      console.error("Missing contribution ID");
      return NextResponse.json(
        { error: "Missing contribution ID" },
        { status: 400 }
      );
    }

    console.log("Fetching contribution with ID:", id);
    const contribution = await getContributionByPrimaryContributionUid(id);

    if (!contribution) {
      console.error("Contribution not found for ID:", id);
      return NextResponse.json(
        { error: "Contribution not found" },
        { status: 404 }
      );
    }

    console.log("Fetching project with name:", contribution.projectName);
    const project = await getProjectByName(contribution.projectName);

    console.log("Fetched contribution and project successfully");
    return NextResponse.json({ contribution, project });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
