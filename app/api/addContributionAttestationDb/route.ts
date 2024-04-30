import { insertAttestation } from "@/src/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { NewContributionAttestation } from "../../../src/types";

export const POST = async (request: Request) => {
  try {
    console.log("Received request to add contribution attestation");

    const newAttestation: NewContributionAttestation = await request.json();
    console.log("New Attestation:", newAttestation);

    const insertedAttestation = await insertAttestation(newAttestation);
    console.log("Inserted Attestation", insertedAttestation);

    return NextResponse.json(insertedAttestation, { status: 200 });
  } catch (error) {
    console.error("Error inserting Attestation", error);
    return NextResponse.json(
      { error: "Failed to insert attestation" },
      { status: 500 }
    );
  }
};
