// app/api/projects/route.ts

import { getProjectsByEcosystem } from "../../../src/lib/db";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    console.log("Received request to get projects");
    const { walletAddress, endpoint, filter, sortOrder } = await request.json();
    console.log("Wallet Address:", walletAddress);
    console.log("Endpoint:", endpoint);
    console.log("Filter:", filter);
    console.log("Sort Order:", sortOrder);

    const projects = await getProjectsByEcosystem(
      walletAddress,
      endpoint,
      filter,
      sortOrder
    );
    console.log("Projects:", projects);

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
};
