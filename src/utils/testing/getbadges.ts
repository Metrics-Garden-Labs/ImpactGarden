import { NextResponse } from "next/server";
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { user_addresses, op_delegates, users } from "../../../src/lib/schema";
import { getAttestationsByCoinbaseVerified } from "../../../src/utils/badges/coinbaseVerified";
import { checkOpBadgeholder } from "../../../src/utils/badges/opBadgeholder";
import { getOptimismSeason4Participant } from "../../../src/utils/badges/getSeason4Participant";
import { eq } from "drizzle-orm";
import {
  NetworkType,
  networkEndpoints,
} from "../../../src/utils/graphqlEndpoints";
import { getAddress } from "viem";
import { sql as vsql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

// Neynar API Client
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const client = new NeynarAPIClient(NEYNAR_API_KEY as string);

const POSTGRES_URL = process.env.POSTGRES_URL;

if (!POSTGRES_URL) {
  console.error("POSTGRES_URL environment variable is not set.");
  process.exit(1); // Exit with failure
}

process.env.POSTGRES_URL = POSTGRES_URL;

const db = drizzle(vsql);

// Addresses for verification checks
const coinbaseAddress = "0x357458739F90461b99789350868CD7CF330Dd7EE";
const optimismAddress = "0x621477dBA416E12df7FF0d48E14c4D20DC85D7D9";
const opAddressS4 = "0x3C7820f2874b665AC7471f84f5cbd6E12871F4cC";

// Network endpoints
const selectedNetwork1 = "Optimism";
const endpoint1 = "https://optimism.easscan.org/graphql";

// Fetch all users from the "users" table and process their badges
export async function processAllUsersBadges() {
  try {
    // Fetch all users from the "users" table
    const allUsers = await db.select().from(users);

    console.log(`Found ${allUsers.length} users in the database.`);

    // Loop over each user and run the getBadges script
    for (const user of allUsers) {
      const { fid, ethaddress } = user;

      if (!fid || !ethaddress) {
        console.log(
          `Skipping user with missing fid or ethAddress: ${user.username}`
        );
        continue;
      }

      console.log(
        `Processing badges for user: ${user.username}, FID: ${fid}, Eth Address: ${ethaddress}`
      );

      try {
        // Normalize the address for checkingx
        const checkAddress = getAddress(ethaddress);

        // Check if the user is an Optimism Delegate
        const isOpDelegate = await (async () => {
          const result = await db
            .select()
            .from(op_delegates)
            .where(eq(op_delegates.address, checkAddress))
            .limit(1);
          return result.length > 0;
        })();

        console.log(
          `Delegate Status for ${user.username} (FID: ${fid}, Eth Address: ${ethaddress}):`,
          isOpDelegate
        );

        // Fetch the existing addresses for the user to determine the address order
        const storedAddresses = await db
          .select()
          .from(user_addresses)
          .where(eq(user_addresses.userfid, fid));

        const existingAddressCount = storedAddresses.length;

        // Determine the correct address order based on the existing addresses
        const addressOrder =
          ["first", "second", "third"][existingAddressCount] || "first"; // Default to 'first' if none found

        // Insert the new address with the correct order if it's not already in the DB
        const addressExists = storedAddresses.some(
          (addr) => addr.ethaddress === ethaddress
        );

        if (!addressExists) {
          // Call the getBadges function to fetch verification data
          const badgeData = await getBadges(fid, ethaddress);

          const newAddress = {
            userfid: fid,
            ethaddress: ethaddress,
            addressorder: addressOrder,
            coinbaseverified: badgeData.isCoinbaseVerified,
            opbadgeholder: badgeData.isOpBadgeholder,
            powerbadgeholder: badgeData.isPowerBadgeholder,
            delegate: isOpDelegate,
            s4participant: badgeData.isSeason4Participant,
          };

          console.log(
            "Inserting new address into DB with order:",
            addressOrder
          );
          await db.insert(user_addresses).values(newAddress);
        } else {
          console.log("Address already exists in the DB.");
        }
      } catch (error) {
        console.error(
          `Failed to process badges or delegate check for user: ${user.username}, FID: ${fid}`
        );
        console.error("Error:", error);
      }
    }

    console.log("Finished processing all users.");
  } catch (error) {
    console.error("Error fetching users from the database:", error);
  }
}

// Function to fetch badge data from external services (e.g., Neynar API, Coinbase, etc.)
async function getBadges(fid: string, ethAddress: string) {
  try {
    const fidData = await client.fetchBulkUsers([parseInt(fid)]);
    const userData = fidData.users[0];

    const checkAddress = getAddress(ethAddress);

    // Coinbase Verification
    const isCoinbaseVerified = await (async () => {
      const coinbaseAttestations = await getAttestationsByCoinbaseVerified(
        coinbaseAddress,
        checkAddress,
        "https://base.easscan.org/graphql"
      );
      return coinbaseAttestations && coinbaseAttestations.length > 0;
    })();

    // Optimism Badgeholder Check
    const isOpBadgeholder = await (async () => {
      const opAttestations = await checkOpBadgeholder(
        optimismAddress,
        checkAddress,
        endpoint1
      );
      return opAttestations && opAttestations.length > 0;
    })();

    // Returning badge information to be used by the main function
    return {
      isCoinbaseVerified,
      isOpBadgeholder,
      isPowerBadgeholder: !!userData.power_badge,
      isSeason4Participant: false, // Placeholder for now
    };
  } catch (error) {
    console.error(`Error processing badges for user FID: ${fid}`, error);
    return {
      isCoinbaseVerified: false,
      isOpBadgeholder: false,
      isPowerBadgeholder: false,
      isSeason4Participant: false,
    };
  }
}

// Run the process
processAllUsersBadges();
