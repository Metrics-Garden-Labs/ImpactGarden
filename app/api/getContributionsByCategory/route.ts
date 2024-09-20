import { NextResponse } from "next/server";
import {
  getContributionsByCategory,
  getUserReviews,
} from "@/src/lib/db/dbcontributions";

export const POST = async (request: Request) => {
  try {
    const { category, page, limit, userFid } = await request.json();
    const allContributions = await getContributionsByCategory(category);
    const userReviews = await getUserReviews(userFid, category);

    const unreviewedContributions = allContributions.contributions.filter(
      (contribution: any) =>
        !userReviews.some(
          (review: any) => review.projectName === contribution.projectName
        )
    );

    const totalUnreviewed = unreviewedContributions.length;
    const startIndex = (page - 1) * limit;
    const paginatedContributions = unreviewedContributions.slice(
      startIndex,
      startIndex + limit
    );

    console.log("Unreviewed contributions", paginatedContributions);

    return NextResponse.json(
      {
        contributions: {
          contributions: paginatedContributions,
          total: totalUnreviewed,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return NextResponse.json(
      { error: "Failed to fetch contributions" },
      { status: 500 }
    );
  }
};
