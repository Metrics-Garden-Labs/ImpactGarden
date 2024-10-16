import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql as vsql } from "@vercel/postgres";
import { user_addresses } from "../../../lib/schema";
import { eq, inArray } from "drizzle-orm";
import { getAddress } from "viem";

const POSTGRES_URL = process.env.POSTGRES_URL;

if (!POSTGRES_URL) {
  console.error("POSTGRES_URL environment variable is not set.");
  process.exit(1);
}

process.env.POSTGRES_URL = POSTGRES_URL;

const db = drizzle(vsql);

interface CheckOpBadgeholderParams {
  badgeholderSchema: string;
  OpAddress: string;
  address: string;
  endpoint1: string;
}

export const checkOpBadgeholder = async ({
  badgeholderSchema,
  OpAddress,
  address,
  endpoint1,
}: CheckOpBadgeholderParams) => {
  try {
    const response = await fetch(endpoint1, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query Attestations($badgeholderSchema: String!, $OpAddress: String!, $address: String!) {
            attestations(where: {
              schemaId: { equals: $badgeholderSchema}
              attester: { equals: $OpAddress },
              recipient: { equals: $address },
            }) {
              id
              attester
              recipient
              refUID
              revocable
              data
            }
          }
        `,
        variables: {
          badgeholderSchema,
          OpAddress,
          address,
        },
      }),
    });

    const { data } = await response.json();

    if (!response.ok) {
      console.error("GraphQL Error:");
      throw new Error("Failed to fetch attestations");
    }

    return data.attestations;
  } catch (error) {
    console.error("Error fetching attestations: ", error);
    throw error;
  }
};

// Function to update badgeholders in the DB
async function updateBadgeholders(
  badgeholderSchema: string,
  OpAddress: string,
  endpoint1: string
) {
  try {
    // Fetch all records from the `user_addresses` table in the database
    const storedAddresses = await db
      .select({
        id: user_addresses.id,
        ethaddress: user_addresses.ethaddress,
      })
      .from(user_addresses);

    console.log(
      `Checking ${storedAddresses.length} addresses for badgeholders.`
    );

    // Prepare array for batch updates
    const badgeholdersToUpdate = [];

    // Iterate through each stored address
    for (const user of storedAddresses) {
      if (user.ethaddress) {
        const checkAddress = getAddress(user.ethaddress);
        const attestations = await checkOpBadgeholder({
          badgeholderSchema,
          OpAddress,
          address: checkAddress,
          endpoint1,
        });

        if (attestations && attestations.length > 0) {
          badgeholdersToUpdate.push(user.id);
          console.log(`Address ${user.ethaddress} is a badgeholder.`);
        }
      }
    }

    // Update the `opbadgeholder` field to true for badgeholders
    if (badgeholdersToUpdate.length > 0) {
      const updateBadgeholdersResult = await db
        .update(user_addresses)
        .set({ opbadgeholder: true })
        .where(inArray(user_addresses.id, badgeholdersToUpdate));

      console.log(
        `Updated ${badgeholdersToUpdate.length} addresses as badgeholders.`
      );
      console.log(updateBadgeholdersResult);
    } else {
      console.log("No badgeholders found to update.");
    }

    console.log("Finished updating badgeholders.");
  } catch (error) {
    console.error("Error processing badgeholders:", error);
  }
}

const badgeholderSchema =
  "0xfdcfdad2dbe7489e0ce56b260348b7f14e8365a8a325aef9834818c00d46b31b";
const OpAddress = "0x621477dBA416E12df7FF0d48E14c4D20DC85D7D9";
const endpoint1 = "https://optimism.easscan.org/graphql";

updateBadgeholders(badgeholderSchema, OpAddress, endpoint1);
