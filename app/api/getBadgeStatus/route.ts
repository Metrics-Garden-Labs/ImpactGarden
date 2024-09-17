// pages/api/getBadgeStatus.ts

import { NextResponse } from "next/server";
import { getUserBadgeStatus } from "../../../src/utils/badges/badgeHelper";

export const POST = async (request: Request) => {
  try {
    const { fid } = await request.json();

    if (!fid) {
      return NextResponse.json(
        { error: "Missing fid parameter" },
        { status: 400 }
      );
    }

    // Fetch badge status using the fid
    const badgeStatus = await getUserBadgeStatus(fid as string);

    return NextResponse.json(badgeStatus, { status: 200 });
  } catch (error) {
    console.error("Error fetching badge status:", error);
    return NextResponse.json(
      { error: "Failed to fetch badge status" },
      { status: 500 }
    );
  }
};
