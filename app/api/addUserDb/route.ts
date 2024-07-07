import { insertUser } from "../../../src/lib/db";
import { NextRequest, NextResponse } from "next/server";

import { db } from "../../../src/lib/db";
import { eq } from "drizzle-orm";
import { users } from "../../../src/lib/schema";
import { NewUser } from "../../../src/types";
import { corsMiddleware } from "../../../src/config/corsMiddleware";

export const POST = async (request: Request) => {
  try {
    const newUser: NewUser = await request.json();

    //check if a user with the same fid already exists
    //const existingUser = await getUserByFid(newUser.fid);

    const fid = newUser.fid;
    //check if already exists in db
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.fid, fid))
      .limit(1)
      .then((result) => result[0]);

    if (existingUser) {
      console.log(
        "User with Fid",
        newUser.fid,
        "already exists in the database. Skipping insertion."
      );
      return NextResponse.json({ message: "User already exists" });
    }

    //insert user into database
    const insertedUser = await insertUser(newUser);
    return NextResponse.json(insertedUser, { status: 200 });
  } catch (error) {
    console.error("Error inserting user", error);
    return NextResponse.json(
      { error: "Failed to insert user" },
      { status: 500 }
    );
  }
};

// export default corsMiddleware(POST);
