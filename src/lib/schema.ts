//use the other table that i made for the other project

import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";
import { useGlobalState } from "../config/config";
import { number } from "zod";

//This is the schema for the users that login to use the app
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    fid: text("fid").notNull().unique(),
    username: text("username").notNull(),
    ethaddress: text("ethaddress"),
    pfp_url: text("pfp_url"),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex("fid_unique_idx").on(users.fid),
    };
  }
);

//this is the projects table for AttestDb Demo
//for the projects i need to add the higher category and subcategories to the db.

export const projects = pgTable(
  "projects",
  {
    id: serial("id").primaryKey(),
    userFid: text("userFid"),
    ethAddress: text("ethAddress").notNull(),
    ecosystem: text("ecosystem").notNull(),
    projectName: text("projectName").notNull(),
    category: text("category"),
    oneliner: text("oneliner"),
    websiteUrl: text("websiteUrl"),
    twitterUrl: text("twitterUrl"),
    githubUrl: text("githubUrl"),
    logoUrl: text("logoUrl"),
    primaryprojectuid: text("primaryprojectuid").unique(),
    projectUid: text("projectUid").unique(),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (projects) => {
    return {
      userIdIdx: uniqueIndex("projects_user_id_idx").on(projects.id),
      projectNameIdx: uniqueIndex("projects_project_name_idx").on(
        projects.projectName
      ),
    };
  }
);

export const contributions = pgTable(
  "contributions",
  {
    id: serial("id").primaryKey(),
    userFid: text("userFid")
      .references(() => users.fid)
      .notNull(),
    projectName: text("projectName")
      .references(() => projects.projectName)
      .notNull(),
    ecosystem: text("ecosystem")
      .references(() => projects.ecosystem)
      .notNull(),
    governancetype: text("governancetype"),
    category: text("category"),
    subcategory: text("subcategory"),
    secondaryecosystem: text("secondaryecosystem"),
    contribution: text("contribution").notNull().unique(),
    desc: text("desc").notNull(),
    link: text("link"),
    ethAddress: text("ethAddress").references(() => projects.ethAddress),
    primarycontributionuid: text("primarycontributionuid").unique(),
    easUid: text("easUid"),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (contributions) => {
    return {
      contIdIdx: uniqueIndex("cont_user_fid_idx").on(contributions.id),
    };
  }
);

//need to make a table for the contributions

export const contributionattestations = pgTable(
  "contributionattestations",
  {
    id: serial("id").primaryKey(),
    userFid: text("userFid")
      .references(() => users.fid)
      .notNull(),
    projectName: text("projectName").references(() => projects.projectName),
    contribution: text("contribution")
      .references(() => contributions.contribution)
      .notNull(),
    ecosystem: text("ecosystem")
      .references(() => contributions.ecosystem)
      .notNull(),
    attestationUID: text("attestationUID").notNull().unique(),
    attesterAddy: text("attesterAddy").notNull(),
    rating: text("rating"),
    improvementareas: text("improvementareas"),
    isdelegate: boolean("isdelegate").default(false),
    feedback: text("feedback"),
    extrafeedback: text("extrafeedback"),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (contributionattestations) => {
    return {
      contAttestIdIdx: uniqueIndex("cont_attest_id_idx").on(
        contributionattestations.id
      ),
    };
  }
);

//table for the eth addresses and verification of the wallets
export const user_addresses = pgTable(
  "user_addresses",
  {
    id: serial("id").primaryKey().unique(),
    userfid: text("userfid")
      .references(() => users.fid)
      .notNull(),
    ethaddress: text("ethaddress"),
    addressorder: text("addressorder"),
    coinbaseverified: boolean("coinbaseverified").default(false),
    opbadgeholder: boolean("opbadgeholder").default(false),
    powerbadgeholder: boolean("powerbadgeholder").default(false),
    delegate: boolean("delegate").default(false),
    s4participant: boolean("s4participant").default(false),
    createdat: timestamp("createdat").defaultNow(),
  },
  (user_addresses) => {
    return {
      uniqueUserAddressIdx: uniqueIndex("unique_user_address_idx").on(
        user_addresses.userfid,
        user_addresses.addressorder,
        user_addresses.ethaddress
      ),
    };
  }
);

export const op_delegates = pgTable(
  "op_delegates",
  {
    id: serial("id").primaryKey(),
    address: text("address").notNull().unique(),
    twitter: text("twitter"),
    createdat: timestamp("createdat").defaultNow(),
  },
  (op_delegates) => {
    return {
      addressIdx: uniqueIndex("address_idx").on(op_delegates.address),
    };
  }
);

//need to add the table for the attestation types
//Governance Tables

//Infra and Tooling

export const governance_infra_and_tooling = pgTable(
  "governance_infra_and_tooling",
  {
    id: serial("id").primaryKey(),
    userfid: text("userfid")
      .references(() => users.fid)
      .notNull(),
    ethaddress: text("ethaddress"),
    projectName: text("projectName")
      .references(() => projects.projectName)
      .notNull(),
    contribution: text("contribution").references(
      () => contributions.contribution
    ),
    category: text("category")
      .references(() => projects.category)
      .notNull(),
    subcategory: text("subcategory")
      .references(() => contributions.subcategory)
      .notNull(),
    ecosystem: text("ecosystem")
      .references(() => projects.ecosystem)
      .notNull(),
    attestationUID: text("attestationUID").notNull(),
    likely_to_recommend: text("likely_to_recommend"),
    feeling_if_didnt_exist: text("feeling_if_didnt_exist"),
    explanation: text("explanation"),
    private_feedback: text("private_feedback"),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (governance_infra_and_tooling) => {
    return {
      governanceInfraAndToolingIdx: uniqueIndex(
        "governance_infra_and_tooling_idx"
      ).on(governance_infra_and_tooling.id),
    };
  }
);

export const governance_r_and_a = pgTable(
  "governance_r_and_a",
  {
    id: serial("id").primaryKey(),
    userfid: text("userfid")
      .references(() => users.fid)
      .notNull(),
    ethaddress: text("ethaddress"),
    projectName: text("projectName")
      .references(() => projects.projectName)
      .notNull(),
    contribution: text("contribution").references(
      () => contributions.contribution
    ),
    category: text("category")
      .references(() => projects.category)
      .notNull(),
    subcategory: text("subcategory")
      .references(() => contributions.subcategory)
      .notNull(),
    ecosystem: text("ecosystem")
      .references(() => projects.ecosystem)
      .notNull(),
    attestationUID: text("attestationUID").notNull(),
    likely_to_recommend: text("likely_to_recommend"),
    useful_for_understanding: text("useful_for_understanding"),
    effective_for_improvements: text("effective_for_improvements"),
    explanation: text("explanation"),
    private_feedback: text("private_feedback"),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (governance_r_and_a) => {
    return {
      governanceRandAIdx: uniqueIndex("governance_r_and_a_idx").on(
        governance_r_and_a.id
      ),
    };
  }
);

export const governance_collab_and_onboarding = pgTable(
  "governance_collab_and_onboarding",
  {
    id: serial("id").primaryKey(),
    userfid: text("userfid")
      .references(() => users.fid)
      .notNull(),
    ethaddress: text("ethaddress"),
    projectName: text("projectName")
      .references(() => projects.projectName)
      .notNull(),
    contribution: text("contribution").references(
      () => contributions.contribution
    ),
    category: text("category")
      .references(() => projects.category)
      .notNull(),
    subcategory: text("subcategory")
      .references(() => contributions.subcategory)
      .notNull(),
    ecosystem: text("ecosystem")
      .references(() => projects.ecosystem)
      .notNull(),
    attestationUID: text("attestationUID").notNull(),
    governance_knowledge: text("governance_knowledge"),
    recommend_contribution: text("recommend_contribution"),
    feeling_if_didnt_exist: text("feeling_if_didnt_exist"),
    explanation: text("explanation"),
    private_feedback: text("private_feedback"),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (governance_collab_and_onboarding) => {
    return {
      governanceCollabAndOnboardingIdx: uniqueIndex(
        "governance_collab_and_onboarding_idx"
      ).on(governance_collab_and_onboarding.id),
    };
  }
);

export const governance_structures_op = pgTable(
  "governance_structures_op",
  {
    id: serial("id").primaryKey(),
    userfid: text("userfid")
      .references(() => users.fid)
      .notNull(),
    ethaddress: text("ethaddress"),
    projectName: text("projectName")
      .references(() => projects.projectName)
      .notNull(),
    contribution: text("contribution").references(
      () => contributions.contribution
    ),
    category: text("category")
      .references(() => projects.category)
      .notNull(),
    subcategory: text("subcategory")
      .references(() => contributions.subcategory)
      .notNull(),
    ecosystem: text("ecosystem")
      .references(() => projects.ecosystem)
      .notNull(),
    attestationUID: text("attestationUID").notNull(),
    feeling_if_didnt_exist: text("feeling_if_didnt_exist"),
    explanation: text("explanation"),
    examples_of_usefulness: text("examples_of_usefulness"),
    private_feedback: text("private_feedback"),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (governance_structures_op) => {
    return {
      governanceStructuresOpIdx: uniqueIndex("governance_structures_op_idx").on(
        governance_structures_op.id
      ),
    };
  }
);
