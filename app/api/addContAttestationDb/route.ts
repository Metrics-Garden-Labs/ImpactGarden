import { insertAttestation } from "@/src/lib/db";
import { NextRequest, NextResponse } from "next/server";

import { db } from "../../../src/lib/db";
import { eq } from "drizzle-orm";
import { contributionAttestations } from "../../../src/lib/schema";
import { NewContributionAttestation } from "../../../src/types";

export const POST = async (request: Request) => {
  try {
    const newAttestation: NewContributionAttestation = await request.json();

    //not going to check if they have already attested, will have to figure this out

    //insert attestation into database
    const insertedAttestation = await insertAttestation(newAttestation);
    console.log("Inserted Attestation", insertedAttestation);
    return NextResponse.json(insertedAttestation, { status: 200 });
  } catch (error) {
    console.error("Error inserting Attestation", error);
    return NextResponse.json(
      { error: "Failed to insert attestation " },
      { status: 500 }
    );
  }
};
