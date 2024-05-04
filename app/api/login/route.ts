import { NextRequest, NextResponse } from "next/server";
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { db } from "../../../src/lib/db";
import { userAddresses } from "../../../src/lib/schema";
import { getAttestationsByCoinbaseVerified } from "../../..//src/utils/coinbaseVerified";
import { checkOpBadgeholder } from "../../..//src/utils/opBadgeholder";
import { eq } from "drizzle-orm";
import { NewUserAddress } from "../../../src/types";

// Neynar API Client
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY as string);

// Addresses for verification checks
const coinbaseAddress = "0x357458739F90461b99789350868CD7CF330Dd7EE";
const optimismAddress = "0x621477dBA416E12df7FF0d48E14c4D20DC85D7D9";

export async function POST(request: NextRequest) {
  const { fid } = await request.json();

  try {
    // Fetch user data via Neynar API
    const fidData = await client.fetchBulkUsers([parseInt(fid)]);
    const userData = fidData.users[0];
    const ethAddresses = userData.verified_addresses.eth_addresses.slice(0, 3); // Get first three addresses

    // Orders for the addresses
    const addressOrders = ["first", "second", "third"];

    // Verify each address concurrently and prepare the results
    const addressInserts = await Promise.all(
      ethAddresses.map(async (ethAddress, index) => {
        // Coinbase Verification
        const isCoinbaseVerified = await (async () => {
          const coinbaseAttestations = await getAttestationsByCoinbaseVerified(
            coinbaseAddress,
            ethAddress,
            "Base"
          );
          return coinbaseAttestations && coinbaseAttestations.length > 0;
        })();

        // Optimism Badgeholder Check
        const isOpBadgeholder = await (async () => {
          const opAttestations = await checkOpBadgeholder(
            optimismAddress,
            ethAddress,
            "Optimism"
          );
          return opAttestations && opAttestations.length > 0;
        })();

        // Warpcast Power Badge (from Neynar API)
        const isPowerBadgeholder = !!userData.power_badge;

        // Return an object matching the `NewUserAddress` structure
        return {
          userFid: fid.toString(),
          ethAddress,
          addressOrder: addressOrders[index],
          coinbaseVerified: isCoinbaseVerified,
          opBadgeHolder: isOpBadgeholder,
          powerBadgeHolder: isPowerBadgeholder,
        };
      })
    );

    // Insert the results into the `user_addresses` table
    await db.insert(userAddresses).values(addressInserts).onConflictDoNothing();

    // Return a successful response
    const response = {
      username: userData.username,
      ethAddress: ethAddresses[0] || "",
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
