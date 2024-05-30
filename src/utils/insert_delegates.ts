import fs from "fs";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import { op_delegates } from "../lib/schema";

const db = drizzle(sql);

const addDelegatesToDB = async () => {
  try {
    // Read the JSON file
    const jsonData = fs.readFileSync("all_delegates.json", "utf-8");
    const delegates = JSON.parse(jsonData);

    // Iterate over the delegates and insert them into the database
    for (const delegate of delegates) {
      await db
        .insert(op_delegates)
        .values({
          address: delegate.address,
          twitter: delegate.twitter,
        })
        .onConflictDoNothing()
        .returning();
    }

    console.log("Delegates added to the database successfully.");
  } catch (error) {
    console.error("Error adding delegates to the database:", error);
  }
};

addDelegatesToDB();
