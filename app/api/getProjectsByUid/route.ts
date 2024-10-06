// /app/api/getPrimaryProjectUids/route.ts

import { NextResponse } from "next/server";
import { db } from "../../../src/lib/db/dbprojects"; // Adjust the path based on your project structure
import { projects } from "../../../src/lib/schema";
import { inArray } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const { projectNames } = await request.json();

    if (!Array.isArray(projectNames) || projectNames.length === 0) {
      return NextResponse.json(
        { error: "Invalid projectNames" },
        { status: 400 }
      );
    }

    const projectData = await db
      .select({
        projectName: projects.projectName,
        primaryprojectuid: projects.primaryprojectuid,
      })
      .from(projects)
      .where(inArray(projects.projectName, projectNames));

    const projectUidMap = projectData.reduce<Record<string, string>>(
      (acc, project) => {
        if (project.projectName && project.primaryprojectuid) {
          acc[project.projectName] = project.primaryprojectuid;
        }
        return acc;
      },
      {}
    );

    return NextResponse.json({ projectUidMap }, { status: 200 });
  } catch (error) {
    console.error("Error fetching project UIDs:", error);
    return NextResponse.json(
      { error: "Failed to fetch project UIDs" },
      { status: 500 }
    );
  }
}
