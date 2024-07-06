import { insertContribution } from "../../../src/lib/db";
import { NextRequest, NextResponse } from "next/server";

import { db } from "../../../src/lib/db";
import { eq } from "drizzle-orm";
import { contributions } from "../../../src/lib/schema";
import { NewContribution } from "../../../src/types";
import { corsMiddleware } from "../../../src/config/corsMiddleware";

const POST = async (request: Request) => {
  try {
    const newContribution: NewContribution = await request.json();

    //check if the contribution already exists

    const contribution = newContribution.contribution;
    //check if already exists in db
    const existingContribution = await db
      .select()
      .from(contributions)
      .where(eq(contributions.contribution, contribution))
      .limit(1)
      .then((result) => result[0]);

    if (existingContribution) {
      console.log(
        "Contribution with name",
        contributions.contribution,
        "already exists in the database. Skipping insertion."
      );
      return NextResponse.json({ message: "Contribution already exists" });
    }

    //insert contribution into database
    const insertedContribution = await insertContribution(newContribution);
    console.log("Inserted Contribution", insertedContribution);
    return NextResponse.json(insertedContribution, { status: 200 });
  } catch (error) {
    console.error("Error inserting Contribution", error);
    return NextResponse.json(
      { error: "Failed to insert contribution " },
      { status: 500 }
    );
  }
};

export default corsMiddleware(POST);
