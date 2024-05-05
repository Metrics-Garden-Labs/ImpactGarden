// Path: app/api/karmalabfarcasterrep/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getProjectsByFids } from "@/src/lib/db";
import { SearchResult } from "@/src/types";

export const POST = async (request: NextRequest) => {
  const url = `https://graph.cast.k3l.io/scores/personalized/engagement/fids?k=1&limit=10&lite=false`;

  try {
    // Parse the incoming request body to extract the `fid`
    const { apifid } = await request.json();
    console.log("apiFID:", apifid);

    if (!apifid) {
      return NextResponse.json({ error: "No FID provided" }, { status: 400 });
    }

    const requestBody = JSON.stringify([apifid]);

    // Make a POST request to the external API
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: requestBody,
    });

    if (!response.ok) {
      console.error("Failed to get Farcaster information");
      return NextResponse.json(
        { error: "Failed to get Farcaster information" },
        { status: response.status }
      );
    }

    // Parse and return the API response
    const data = await response.json();

    // Check if data has a 'result' property and it is an array
    if (data.result && Array.isArray(data.result)) {
      const filteredResults = data.result.slice(1);
      const fids = filteredResults.map((result: SearchResult) =>
        result.fid.toString()
      );
      const projectsByFids = await getProjectsByFids(fids);
      console.log("Farcaster Data:", data.result);
      console.log("Projects by FIDs:", projectsByFids);

      return NextResponse.json(
        { farcasterData: data.result, projects: projectsByFids },
        { status: 200 }
      );
    } else {
      console.error("Unexpected response format from Farcaster API");
      return NextResponse.json(
        { error: "Unexpected response format from Farcaster API" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error occurred while getting Farcaster information:", error);
    return NextResponse.json(
      { error: "Failed to get Farcaster information" },
      { status: 500 }
    );
  }
};
