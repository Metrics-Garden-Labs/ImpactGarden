// app/api/projects/route.ts

import { getProjects } from "../../../src/lib/db";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    console.log("Received request to get projects");
    const { query, filter, walletAddress, endpoint, sortOrder } =
      await request.json();
    console.log("Wallet Addressapi:", walletAddress);
    console.log("Endpoint: api", endpoint);
    console.log("Filter:api ", filter);

    const projects = await getProjects(walletAddress, endpoint, filter);
    //console.log("Projects:", projects);

    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
};
