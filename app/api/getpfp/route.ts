import { getUserPfp } from "../../../src/lib/db/dbusers";
import { NextResponse } from "next/server";
import { corsMiddleware } from "../../../src/config/corsMiddleware";

export const POST = async (request: Request) => {
  try {
    console.log("Received request to get attestation count");

    const { userFid } = await request.json();
    console.log("userfid", userFid);

    // const response = await getAttestationsByContribution(contribution);
    // console.log("Contribution Attestations", response);
    const response = await getUserPfp(userFid);
    console.log("pfp", response);

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    console.error("Error fetching attestation count:", error);
    return NextResponse.json(
      { error: "Failed to fetch attestation count" },
      { status: 500 }
    );
  }
};

// export default corsMiddleware(POST);
