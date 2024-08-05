// import { fetchAllAttestationsWithLogos } from "@/src/lib/db/dbattestations";
// import { getProjectsByUserId } from "@/src/lib/db/dbprojects";
// import { NextResponse } from "next/server";
// import { corsMiddleware } from "@/src/config/corsMiddleware";

// export const POST = async (request: Request) => {
//   try {
//     console.log("Received request to get user data");

//     const { fid } = await request.json();
//     console.log("User FID:", fid);

//     if (!fid) {
//       return NextResponse.json({ error: "FID is required" }, { status: 400 });
//     }

//     const [attestations, projects] = await Promise.all([
//       fetchAllAttestationsWithLogos(fid),
//       getProjectsByUserId(fid),
//     ]);

//     console.log("Fetched attestations count:", attestations.length);
//     console.log("Fetched projects count:", projects.length);

//     return NextResponse.json({ attestations, projects }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch user data" },
//       { status: 500 }
//     );
//   }
// };

// // Uncomment the following line if you want to apply CORS middleware
// // export default corsMiddleware(POST);

import { fetchAllAttestationsWithLogos } from "@/src/lib/db/dbattestations";
import { getProjectsByUserId } from "@/src/lib/db/dbprojects";
import { NextResponse } from "next/server";
import { corsMiddleware } from "@/src/config/corsMiddleware";

export const POST = async (request: Request) => {
  try {
    console.log("Received request to get user data");

    const { fid } = await request.json();
    console.log("User FID:", fid);

    if (!fid) {
      return NextResponse.json({ error: "FID is required" }, { status: 400 });
    }

    const [attestations, projects] = await Promise.all([
      fetchAllAttestationsWithLogos(fid),
      getProjectsByUserId(fid),
    ]);

    console.log("Fetched attestations count:", attestations.length);
    console.log("Fetched projects count:", projects.length);

    // Log a sample attestation (first one) to check its structure
    if (attestations.length > 0) {
      console.log(
        "Sample attestation:",
        JSON.stringify(attestations[0], null, 2)
      );
    }

    // Check for specific fields in attestations
    const sampleFields = attestations.map((att) => ({
      id: att.id,
      category: att.category,
      subcategory: att.subcategory,
      likely_to_recommend: att.likely_to_recommend,
      feeling_if_didnt_exist: att.feeling_if_didnt_exist,
      useful_for_understanding: att.useful_for_understanding,
      effective_for_improvements: att.effective_for_improvements,
      governance_knowledge: att.governance_knowledge,
      recommend_contribution: att.recommend_contribution,
    }));
    console.log(
      "Sample fields from first 5 attestations:",
      JSON.stringify(sampleFields, null, 2)
    );

    return NextResponse.json({ attestations, projects }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
};

// Uncomment the following line if you want to apply CORS middleware
// export default corsMiddleware(POST);
