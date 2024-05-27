import { insertProject } from "../../../src/lib/db";
import { NextRequest, NextResponse } from "next/server";

import { db } from "../../../src/lib/db";
import { eq } from "drizzle-orm";
import { projects } from "../../../src/lib/schema";
import { NewProject } from "../../../src/types";
import { getEmbedding } from "@/src/config/openai";
import { ProjectInfo } from "@/src/lib/pinecone";
import { RecordMetadata, RecordValues } from "@pinecone-database/pinecone";

//in this file we insert new projects into the database, i am also trying to embed the information for the ai to use.

export const POST = async (request: Request) => {
  try {
    const newProject: NewProject = await request.json();

    //check if the project already exists
    //just the logic for this demo, if the project name still exists
    //it cannot be created again

    const projectName = newProject.projectName;
    //check if already exists in db
    const existingProject = await db
      .select()
      .from(projects)
      .where(eq(projects.projectName, projectName))
      .limit(1)
      .then((result) => result[0]);

    if (existingProject) {
      console.log(
        "Project with name",
        newProject.projectName,
        "already exists in the database. Skipping insertion."
      );
      return NextResponse.json({ message: "Project already exists" });
    }

    // const embedding = await getEmbeddingForProject(newProject);

    // const insertedProject = await db.transaction(async (tx) => {
    const insertedProject = await insertProject(newProject);

    // await ProjectInfo.upsert([
    //   {
    //   id: newProject.id.toString(),
    //   values: embedding,
    //   }
    // ])
    // });

    //insert project into database
    return NextResponse.json(insertedProject, { status: 200 });
  } catch (error) {
    console.error("Error inserting project", error);
    return NextResponse.json(
      { error: "Failed to insert project" },
      { status: 500 }
    );
  }
};
// Path: app/api/addUserDb/route.ts

// async function getEmbeddingForProject(newProject: NewProject) {
//   return getEmbedding(
//     newProject.projectName +
//       "\n\n" +
//       newProject.ecosystem +
//       "\n\n" +
//       newProject.userFid +
//       "\n\n" +
//       newProject.githubUrl ?? ""
//   );
// }
