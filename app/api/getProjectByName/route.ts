import { getProjectByName } from "../../../src/lib/db/dbprojects";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    console.log("Received request to get project by name");
    const { projectName } = await request.json();
    console.log("Project Name: ", projectName);

    const project = await getProjectByName(projectName);
    console.log("Project:", project);

    return NextResponse.json({ project }, { status: 200 });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 }
    );
  }
};
