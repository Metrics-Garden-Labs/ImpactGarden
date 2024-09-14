import fs from "fs";
import path from "path";
import { getAddress } from "viem";
import { sql as vsql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { user_addresses, op_delegates } from "../../../src/lib/schema"; // Assuming this is the correct import for your schema
import { eq } from "drizzle-orm";
import { fileURLToPath } from "url";

// Initialize the database connection

const db = drizzle(vsql);

// Get the current directory of the module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the `all_delegates.json` file
const delegatesFilePath = path.join(__dirname, "all_delegates.json");

// Function to check if the database addresses are in the delegate list
async function checkDelegatesFromDB() {
  try {
    // Read the delegate addresses from the JSON file
    const rawData = fs.readFileSync(delegatesFilePath, "utf-8");
    const allDelegates = JSON.parse(rawData);

    // Normalize all delegate addresses and store them in a Set for efficient lookup
    const delegateSet = new Set(
      allDelegates.map((delegate: { address: string }) =>
        getAddress(delegate.address)
      )
    );

    // Fetch all Ethereum addresses from the `user_addresses` table in the database
    const storedAddresses = await db.select().from(user_addresses);

    console.log(
      `Checking ${storedAddresses.length} addresses from the database.`
    );

    // Iterate through each stored address and check if it exists in the delegate list
    for (const user of storedAddresses) {
      if (user.ethaddress) {
        // Normalize the DB address
        const normalizedAddress = getAddress(user.ethaddress);

        const isDelegate = delegateSet.has(normalizedAddress);

        if (isDelegate) {
          console.log(`Address ${normalizedAddress} is a delegate.`);

          // Log the current row before updating
          const existingEntry = await db
            .select()
            .from(user_addresses)
            .where(eq(user_addresses.ethaddress, normalizedAddress));
          console.log(
            `Existing entry for address ${normalizedAddress}: `,
            existingEntry
          );

          // Update the `delegate` field in the `user_addresses` table to `true`
          const updateResult = await db
            .update(user_addresses)
            .set({ delegate: isDelegate })
            .where(eq(user_addresses.ethaddress, normalizedAddress));

          console.log(`Update result for ${normalizedAddress}: `, updateResult);

          console.log(`Update result for ${normalizedAddress}: `, updateResult);
        } else {
          console.log(`Address ${normalizedAddress} is NOT a delegate.`);

          // Log the current row before updating
          const existingEntry = await db
            .select()
            .from(user_addresses)
            .where(eq(user_addresses.ethaddress, normalizedAddress));
          console.log(
            `Existing entry for address ${normalizedAddress}: `,
            existingEntry
          );

          // Update the `delegate` field in the `user_addresses` table to `false`
          const updateResult = await db
            .update(user_addresses)
            .set({ delegate: isDelegate })
            .where(eq(user_addresses.ethaddress, normalizedAddress));

          console.log(`Update result for ${normalizedAddress}: `, updateResult);
        }
      } else {
        console.log(`Address from DB is null and cannot be checked.`);
      }
    }

    console.log("Finished checking and updating delegates.");
  } catch (error) {
    console.error("Error reading or processing delegates:", error);
  }
}

// Run the check
checkDelegatesFromDB();
