// pages/api/projects.ts

import { NextRequest, NextResponse } from "next/server";
import { getProjects } from "../../../src/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, endpoint } = await request.json();
    const projects = await getProjects(
      walletAddress as string,
      endpoint as string
    );
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
