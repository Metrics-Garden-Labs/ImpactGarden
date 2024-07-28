import { migrate } from "drizzle-orm/vercel-postgres/migrator";
import { db } from "../lib/db/dbusers";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

// const sql = postgres("...", { max: 1 })
// const db = drizzle(sql);
// await migrate(db, { migrationsFolder: "drizzle" });
// await sql.end();

async function main() {
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations applied successfully!");
  } catch (error) {
    console.error("Failed to apply migrations:", error);
  }
}

main();
