import { getAttestationsByContribution } from "../../../src/lib/db";
import { NextResponse } from "next/server";
import { corsMiddleware } from "@/src/config/corsMiddleware";

const POST = async (request: Request) => {
  try {
    console.log("Received request to get attestation count");

    const { contribution } = await request.json();
    console.log("Contribution:", contribution);

    const response = await getAttestationsByContribution(contribution);
    console.log("Attestation count:", response.length);
    const count = response.length;

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error("Error fetching attestation count:", error);
    return NextResponse.json(
      { error: "Failed to fetch attestation count" },
      { status: 500 }
    );
  }
};

export default corsMiddleware(POST);
