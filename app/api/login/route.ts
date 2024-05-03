import { NextRequest, NextResponse } from "next/server";
import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY as string);
console.log("Client", client);

export async function POST(request: NextRequest) {
  const { fid } = await request.json();

  try {
    const fidData = await client.fetchBulkUsers([parseInt(fid)]);
    const userData = fidData.users[0];
    console.log("User Data", userData);
    const response = {
      username: userData.username,
      ethAddress: userData.verified_addresses.eth_addresses,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching data", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
