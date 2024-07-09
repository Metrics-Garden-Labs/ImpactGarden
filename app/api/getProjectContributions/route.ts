// pages/api/getContributions.ts
import { NextResponse } from "next/server";
import { getContributionsByProjectName } from "@/src/lib/db";
import { corsMiddleware } from "@/src/config/corsMiddleware";

export const POST = async (request: Request) => {
  try {
    console.log("Received request to get contributions");

    const { projectName } = await request.json();

    if (!projectName) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    console.log("Project name:", projectName);

    const response = await getContributionsByProjectName(projectName);

    console.log("Contributions:", response);

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return NextResponse.json(
      { error: "Failed to fetch contributions" },
      { status: 500 }
    );
  }
};

// export default corsMiddleware(POST);
