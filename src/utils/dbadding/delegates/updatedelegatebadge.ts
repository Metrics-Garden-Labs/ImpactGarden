import fs from "fs";
import path from "path";
import { getAddress } from "viem";
import { sql as vsql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { user_addresses } from "../../../lib/schema"; // Adjust the import path as necessary
import { eq, inArray } from "drizzle-orm";
import { fileURLToPath } from "url";

const POSTGRES_URL = process.env.POSTGRES_URL;

if (!POSTGRES_URL) {
  console.error("POSTGRES_URL environment variable is not set.");
  process.exit(1);
}

process.env.POSTGRES_URL = POSTGRES_URL;

const db = drizzle(vsql);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const delegatesFilePath = path.join(__dirname, "top100delegates.json");

// Function to update delegates in the DB
async function updateDelegatesInDB() {
  try {
    // Read the delegate addresses from the JSON file
    const rawData = fs.readFileSync(delegatesFilePath, "utf-8");
    const topDelegates = JSON.parse(rawData);

    // Normalize all delegate addresses and store them in a Set for efficient lookup
    const delegateSet = new Set(
      topDelegates.map((delegate: { Address: string }) =>
        getAddress(delegate.Address)
      )
    );

    // Fetch all Ethereum addresses from the `user_addresses` table in the database
    const storedAddresses = await db
      .select({
        id: user_addresses.id,
        ethaddress: user_addresses.ethaddress,
      })
      .from(user_addresses);

    console.log(
      `Checking ${storedAddresses.length} addresses from the database.`
    );

    // Prepare arrays for batch updates
    const delegatesToUpdate = [];

    // Iterate through each stored address and check if it exists in the delegate list
    for (const user of storedAddresses) {
      if (user.ethaddress) {
        const normalizedAddress = getAddress(user.ethaddress);

        if (delegateSet.has(normalizedAddress)) {
          delegatesToUpdate.push(user.id);
        }
      }
    }

    // Update the `delegate` field to true for delegates
    if (delegatesToUpdate.length > 0) {
      const updateDelegatesResult = await db
        .update(user_addresses)
        .set({ delegate: true })
        .where(inArray(user_addresses.id, delegatesToUpdate));

      console.log(
        `Updated ${delegatesToUpdate.length} addresses as delegates.`
      );
      console.log(updateDelegatesResult);
    }

    console.log("Finished updating delegates.");
  } catch (error) {
    console.error("Error reading or processing delegates:", error);
  }
}

updateDelegatesInDB();
