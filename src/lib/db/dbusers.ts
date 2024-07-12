import "../config";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql as vercelsql } from "@vercel/postgres";
import {
  users,
  projects,
  contributions,
  contributionattestations,
  user_addresses,
  op_delegates,
} from "../schema";
import * as schema from "../schema";
import { getAttestationsByAttester } from "../eas";
import { Waterfall } from "next/font/google";
import {
  Project,
  newUserAddresses,
  Attestation,
  ProjectCount,
  Contribution,
} from "@/src/types";
import { count } from "console";
import { desc, sql as drizzlesql } from "drizzle-orm";
import { inArray, eq, sql } from "drizzle-orm";

export const db = drizzle(vercelsql, { schema });

export const getUsers = async () => {
  try {
    const selectResult = await db.select().from(users);
    console.log("Results", selectResult);
    return selectResult;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

export const getUserByFid = async (fid: string) => {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.fid, fid))
      .limit(1);

    if (user.length === 0) {
      return null;
    }

    return user[0];
  } catch (error) {
    console.error(`Error retrieving user '${fid}':`, error);
    throw error;
  }
};

//for the users table
export type NewUser = typeof users.$inferInsert;

export const insertUser = async (user: NewUser) => {
  try {
    return db.insert(users).values(user).returning();
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error;
  }
};

export const getUsers2 = async () => {
  try {
    const result = await db.query.users.findMany();
    return result;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (user.length === 0) {
      return null;
    }

    return user[0];
  } catch (error) {
    console.error(`Error retrieving user '${username}':`, error);
    throw error;
  }
};

//get user badge for the verification and searchusers page
// src/lib/db.ts

export const getUsersVerification = async (filter: string, query: string) => {
  try {
    let selectResult;

    if (filter === "coinbaseVerified") {
      selectResult = await db
        .select({
          users: {
            id: users.id,
            fid: users.fid,
            username: users.username,
            ethaddress: users.ethaddress,
            pfp_url: users.pfp_url,
            createdAt: users.createdAt,
          },
          userAddresses: {
            coinbaseVerified: user_addresses.coinbaseverified,
            opBadgeholder: sql<boolean>`false`.as("opBadgeholder"),
            powerBadgeholder: sql<boolean>`false`.as("powerBadgeholder"),
            isdelegate: sql<boolean>`false`.as("isdelegate"),
            s4Participant: sql<boolean>`false`.as("s4Participant"),
          },
        })
        .from(users)
        .leftJoin(user_addresses, eq(users.fid, user_addresses.userfid))
        .where(eq(user_addresses.coinbaseverified, true));
    } else if (filter === "opBadgeholder") {
      selectResult = await db
        .select({
          users: {
            id: users.id,
            fid: users.fid,
            username: users.username,
            ethaddress: users.ethaddress,
            pfp_url: users.pfp_url,
            createdAt: users.createdAt,
          },
          userAddresses: {
            coinbaseVerified: sql<boolean>`false`.as("coinbaseVerified"),
            opBadgeholder: user_addresses.opbadgeholder,
            powerBadgeholder: sql<boolean>`false`.as("powerBadgeholder"),
            isdelegate: sql<boolean>`false`.as("isdelegate"),
            s4Participant: sql<boolean>`false`.as("s4Participant"),
          },
        })
        .from(users)
        .leftJoin(user_addresses, eq(users.fid, user_addresses.userfid))
        .where(eq(user_addresses.opbadgeholder, true));
    } else if (filter === "powerBadgeholder") {
      selectResult = await db
        .select({
          users: {
            id: users.id,
            fid: users.fid,
            username: users.username,
            ethaddress: users.ethaddress,
            pfp_url: users.pfp_url,
            createdAt: users.createdAt,
          },
          userAddresses: {
            coinbaseVerified: sql<boolean>`false`.as("coinbaseVerified"),
            opBadgeholder: sql<boolean>`false`.as("opBadgeholder"),
            powerBadgeholder: user_addresses.powerbadgeholder,
            isdelegate: sql<boolean>`false`.as("isdelegate"),
            s4Participant: sql<boolean>`false`.as("s4Participant"),
          },
        })
        .from(users)
        .leftJoin(user_addresses, eq(users.fid, user_addresses.userfid))
        .where(eq(user_addresses.powerbadgeholder, true));
    } else if (filter === "delegate") {
      selectResult = await db
        .select({
          users: {
            id: users.id,
            fid: users.fid,
            username: users.username,
            ethaddress: users.ethaddress,
            pfp_url: users.pfp_url,
            createdAt: users.createdAt,
          },
          userAddresses: {
            coinbaseVerified: sql<boolean>`false`.as("coinbaseVerified"),
            opBadgeholder: sql<boolean>`false`.as("opBadgeholder"),
            powerBadgeholder: sql<boolean>`false`.as("powerBadgeholder"),
            isdelegate: user_addresses.delegate,
            s4Participant: sql<boolean>`false`.as("s4Participant"),
          },
        })
        .from(users)
        .leftJoin(user_addresses, eq(users.fid, user_addresses.userfid))
        .where(eq(user_addresses.delegate, true));
    } else if (filter === "s4Participant") {
      selectResult = await db
        .select({
          users: {
            id: users.id,
            fid: users.fid,
            username: users.username,
            ethaddress: users.ethaddress,
            pfp_url: users.pfp_url,
            createdAt: users.createdAt,
          },
          userAddresses: {
            coinbaseVerified: sql<boolean>`false`.as("coinbaseVerified"),
            opBadgeholder: sql<boolean>`false`.as("opBadgeholder"),
            powerBadgeholder: sql<boolean>`false`.as("powerBadgeholder"),
            isdelegate: sql<boolean>`false`.as("isdelegate"),
            s4Participant: user_addresses.s4participant,
          },
        })
        .from(users)
        .leftJoin(user_addresses, eq(users.fid, user_addresses.userfid))
        .where(eq(user_addresses.s4participant, true));
    } else {
      selectResult = await db
        .select({
          users: {
            id: users.id,
            fid: users.fid,
            username: users.username,
            ethaddress: users.ethaddress,
            pfp_url: users.pfp_url,
            createdAt: users.createdAt,
          },
          userAddresses: {
            coinbaseVerified: user_addresses.coinbaseverified,
            opBadgeholder: user_addresses.opbadgeholder,
            powerBadgeholder: user_addresses.powerbadgeholder,
            isdelegate: user_addresses.delegate,
            s4Participant: user_addresses.s4participant,
          },
        })
        .from(users)
        .leftJoin(user_addresses, eq(users.fid, user_addresses.userfid));
    }

    // Additional query filter if provided
    if (query) {
      selectResult = selectResult.filter((user) => {
        return user.users.username.toLowerCase().includes(query.toLowerCase());
      });
    }

    console.log("Results", selectResult);
    return selectResult;
  } catch (error) {
    console.error("Error retrieving users:", error);
    throw error;
  }
};

// Function to insert or update user data including `pfp_url`
export const insertOrUpdateUser = async (user: NewUser) => {
  try {
    // Your logic to upsert a user record
    // Ensure you insert or update the `pfp_url` field
    return db
      .insert(users)
      .values(user)
      .onConflictDoUpdate({
        target: [users.fid],
        set: {
          username: user.username,
          ethaddress: user.ethaddress,
          pfp_url: user.pfp_url, // Ensure `pfp_url` is included here
        },
      })
      .returning();
  } catch (error) {
    console.error("Error inserting or updating user:", error);
    throw error;
  }
};

export const getUserProjectAttestations = async (
  userProjectNames: string[]
) => {
  try {
    const userprojectsattestations = await db
      .select()
      .from(contributionattestations)
      .where(inArray(contributionattestations.projectName, userProjectNames))
      .execute();
    return userprojectsattestations;
  } catch (error) {
    console.error(
      `Error retrieving projects for user '${userProjectNames.join(",")}':`,
      error
    );
    throw error;
  }
};

//for adding the user address to the db
export type NewUserAddress = typeof schema.user_addresses.$inferInsert;

export const insertUserAddress = async (addresses: newUserAddresses[]) => {
  try {
    const userAddressInsert = await db
      .insert(user_addresses)
      .values(addresses)
      .returning();
    console.log("User Address Insert", userAddressInsert);
    return userAddressInsert;
  } catch (error) {
    console.error("Error inserting user address:", error);
    throw error;
  }
};

export const getUserAddressesByFid = async (userFid: string) => {
  try {
    const addresses = await db
      .select()
      .from(user_addresses)
      .where(eq(user_addresses.userfid, userFid))
      .execute();
    return addresses;
  } catch (error) {
    console.error(`Error retrieving user addresses for '${userFid}':`, error);
    throw error;
  }
};

//not sure about this one.
export const updateEthereumAddressStatus = async (
  userFid: string,
  ethAddress: string,
  statusUpdates: Partial<newUserAddresses>
) => {
  try {
    const updated = await db
      .update(user_addresses)
      .set(statusUpdates)
      .where(
        eq(user_addresses.userfid, userFid) &&
          eq(user_addresses.ethaddress, ethAddress)
      )
      .returning();
    return updated;
  } catch (error) {
    console.error("Error updating Ethereum address status:", error);
    throw error;
  }
};

export const getUserPfp = async (userFid: string) => {
  try {
    const userPfp = await db
      .select({
        pfpUrl: users.pfp_url,
      })
      .from(users)
      .where(eq(users.fid, userFid))
      .limit(1);

    if (userPfp.length === 0) {
      return null;
    }

    return userPfp[0];
  } catch (error) {
    console.error(`Error retrieving user pfp for '${userFid}':`, error);
    throw error;
  }
};
