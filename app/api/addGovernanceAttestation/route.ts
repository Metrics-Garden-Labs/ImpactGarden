import { NextRequest, NextResponse } from "next/server";
import {
  NewContributionAttestation,
  GovernanceInfraAndToolingAttestation,
  GovernanceRandAAttestation,
  GovernanceCollabAndOnboardingAttestation,
  NewContributionAttestationGov,
  GovernanceStrucutresAttestation,
} from "@/src/types";
import {
  insertGovernanceInfraToolingAttestation,
  insertGovernanceRandAAttestation,
  insertGovernanceCollabAndOnboardingAttestation,
  insertGovernanceStructuresAttestation,
} from "@/src/lib/db/dbattestations";

export const POST = async (request: Request) => {
  try {
    console.log("Received request to add contribution attestation");

    const newAttestation: NewContributionAttestationGov = await request.json();
    console.log("New Attestation:", newAttestation);
    console.log("New Attestation Category:", newAttestation.category);
    console.log("New Attestation Subcategory:", newAttestation.subcategory);

    let insertedAttestation;
    switch (newAttestation.category) {
      case "Governance":
        switch (newAttestation.subcategory) {
          case "Infra & Tooling":
            insertedAttestation = await insertGovernanceInfraToolingAttestation(
              newAttestation as GovernanceInfraAndToolingAttestation
            );
            break;
          case "Governance Research & Analytics":
            insertedAttestation = await insertGovernanceRandAAttestation(
              newAttestation as GovernanceRandAAttestation
            );
            break;
          case "Collaboration & Onboarding":
            insertedAttestation =
              await insertGovernanceCollabAndOnboardingAttestation(
                newAttestation as GovernanceCollabAndOnboardingAttestation
              );
            break;
          case "Governance Structures":
            insertedAttestation = await insertGovernanceStructuresAttestation(
              newAttestation as GovernanceStrucutresAttestation
            );
            break;
          default:
            throw new Error(`Unsupported category: ${newAttestation.category}`);
        }
        console.log("Inserted Attestation", insertedAttestation);

        return NextResponse.json(insertedAttestation, { status: 200 });
    }
  } catch (error) {
    console.error("Error inserting Attestation", error);
    return NextResponse.json(
      { error: "Failed to insert attestation" },
      { status: 500 }
    );
  }
};
