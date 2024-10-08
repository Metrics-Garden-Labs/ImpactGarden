import { op_stack, users } from "../../lib/schema";

import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql as vsql } from "@vercel/postgres";
import {
  Project,
  newUserAddresses,
  Attestation,
  ProjectCount,
  Contribution,
  NewProject,
  NewContributionAttestationGov,
  Attestation2,
  Attestation3,
  ProjectAttestations,
  Attestation4,
} from "@/src/types";
import * as schema from "../../lib/schema";
import { desc, sql as drizzlesql } from "drizzle-orm";
import { inArray, eq, sql } from "drizzle-orm";

const POSTGRES_URL = process.env.POSTGRES_URL;
if (!POSTGRES_URL) {
  console.error("POSTGRES_URL environment variable is not set.");
  process.exit(1); // Exit with failure
}

process.env.POSTGRES_URL = POSTGRES_URL;

const db = drizzle(vsql);

async function fetchOpStackWithUsername() {
  const result = await db
    .select({
      opStackId: op_stack.id,
      userFid: op_stack.userfid,
      ethAddress: op_stack.ethaddress,
      projectName: op_stack.projectName,
      contribution: op_stack.contribution,
      category: op_stack.category,
      subcategory: op_stack.subcategory,
      ecosystem: op_stack.ecosystem,
      attestationUid: op_stack.attestationUID,
      feelingIfDidntExist: op_stack.feeling_if_didnt_exist,
      explanation: op_stack.explanation,
      createdAt: op_stack.createdAt,
      username: users.username,
    })
    .from(op_stack)
    .innerJoin(users, eq(op_stack.userfid, users.fid));

  console.log(result);
  return result;
}

fetchOpStackWithUsername();
