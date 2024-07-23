import {
  getAttestationsByContribution,
  getContributionAttestationList,
} from "../../../src/lib/db/dbattestations";
import { NextResponse } from "next/server";
import { corsMiddleware } from "../../../src/config/corsMiddleware";

export const POST = async (request: Request) => {
  try {
    console.log("Received request to get attestation count");

    const { contribution } = await request.json();
    console.log("Contribution:", contribution);

    // const response = await getAttestationsByContribution(contribution);
    // console.log("Contribution Attestations", response);
    const attestations = await getContributionAttestationList(contribution);
    console.log("Contribution Attestations", attestations);

    return NextResponse.json({ attestations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching attestation count:", error);
    return NextResponse.json(
      { error: "Failed to fetch attestation count" },
      { status: 500 }
    );
  }
};

// export default corsMiddleware(POST);
