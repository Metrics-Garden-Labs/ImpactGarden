import { getAttestationsByContributionAndSubcategory } from "@/src/lib/db/dbattestations";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    console.log("Received request to get attestation count");

    const { contribution, category, subcategory } = await request.json();
    console.log("Contribution:", contribution);
    console.log("Category:", category);
    console.log("Subcategory:", subcategory);

    const attestations = await getAttestationsByContributionAndSubcategory(
      contribution,
      category,
      subcategory
    );
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
