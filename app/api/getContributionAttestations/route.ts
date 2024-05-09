import {
  getAttestationsByContribution,
  getContributionAttestationList,
} from "../../../src/lib/db";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    console.log("Received request to get attestation count");

    const { contribution } = await request.json();
    console.log("Contribution:", contribution);

    // const response = await getAttestationsByContribution(contribution);
    // console.log("Contribution Attestations", response);
    const response = await getContributionAttestationList(contribution);
    console.log("Contribution Attestations", response);

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error("Error fetching attestation count:", error);
    return NextResponse.json(
      { error: "Failed to fetch attestation count" },
      { status: 500 }
    );
  }
};
