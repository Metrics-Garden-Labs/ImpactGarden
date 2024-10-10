"use server";

import { getAttestationsByUserId } from "@/src/lib/db/dbattestations";
import { getContributionsByProjectName } from "@/src/lib/db/dbcontributions";
import {
  getProjectsByCategoryAndSubcategory,
  getContributionsByCategoryAndSubcategory,
} from "@/src/lib/db/dbprojects";
import type { Contribution } from "@/src/types";

export const getUserAttestations = async (fid: string) => {
  const attestations = await getAttestationsByUserId(fid);
  return attestations;
};

export const getProjectByForCategories = async (
  category: string,
  subcategory: string
) => {
  const projects = await getProjectsByCategoryAndSubcategory(
    category,
    subcategory
  );
  return projects;
};

export const getContributionsForProjectName = async (projectName: string) => {
  const attestations = await getContributionsByProjectName(projectName);
  return attestations;
};

export async function getContributions(
  category: string,
  subcategory: string,
  sortOrder: string
): Promise<Contribution[]> {
  try {
    console.log(
      "Fetching contributions for category:",
      category,
      "subcategory:",
      subcategory,
      "sortOrder:",
      sortOrder
    );

    // Fetch contributions by category and subcategory
    let contributions = await getContributionsByCategoryAndSubcategory(
      category,
      subcategory,
      sortOrder
    );

    // Apply sorting logic
    if (sortOrder === "Most Attested") {
      contributions.sort(
        (a, b) => (b.attestationCount || 0) - (a.attestationCount || 0)
      );
    } else if (sortOrder === "Recently Added") {
      contributions.sort(
        (a, b) =>
          (b.createdAt ? new Date(b.createdAt).getTime() : 0) -
          (a.createdAt ? new Date(a.createdAt).getTime() : 0)
      );
    } else if (sortOrder === "A-Z") {
      contributions.sort((a, b) =>
        a.contribution.localeCompare(b.contribution)
      );
    } else if (sortOrder === "Z-A") {
      contributions.sort((a, b) =>
        b.contribution.localeCompare(a.contribution)
      );
    }

    console.log("Sorted contributions:", contributions.slice(0, 5));
    return contributions;
  } catch (error) {
    console.error("Error fetching contributions:", error);
    throw new Error("Failed to fetch contributions");
  }
}
