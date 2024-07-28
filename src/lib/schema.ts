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

//to add columns to the schema you can add them in as usual then
//run yarn drizzle-kit push:pg, it will add the columns to the database
//useful for prototyping
//when there is more data use the migrations

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
//gonna have to rethink the whole db design

//make the project have to be unique for the linking, will
//have to be a pop up that says if a username has already been taken
//hopefully that will migrate easily

//contributions that are linked to the project
//does the primarykey have to ve the id
//linked to the FID? or linked to the projectName -

//do i put in the ethAddy
//see if contIdIdx makes sense
//store the eth address that the project is using

//need to store the uid of the contribution for reference
//contribution uid: 0xc2b54ed545c65de9f5058c2893b8e8cb51ff731e2c90b189c2cf97bac04b5953
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
    category: text("category").references(() => projects.category),
    subcategory: text("subcategory"),
    secondaryecosystem: text("secondaryecosystem"),
    contribution: text("contribution").notNull().unique(),
    desc: text("desc").notNull(),
    link: text("link"),
    ethAddress: text("ethAddress").references(() => projects.ethAddress),
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

//table for the attestations that are linked to the contribution
//this table will track the number of attestations to a contribution
//userFid tracked to see who made the attestation
//this will be the basic one to say that you liked a project
//track the type of attestation that they made
//will need to attest to the contributionID?
//attestation type will be what they thought about the project, "like", built with etc

//for this maybe only one attestation towards a certain contribution per fid
//pop up that says this user has already attested to this contibution

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
    category: text("category")
      .references(() => projects.category)
      .notNull(),
    subcategory: text("subcategory")
      .references(() => contributions.subcategory)
      .notNull(),
    ecosystem: text("ecosystem")
      .references(() => projects.ecosystem)
      .notNull(),
    attestationUID: text("attestationUID").notNull().unique(),
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
    category: text("category")
      .references(() => projects.category)
      .notNull(),
    subcategory: text("subcategory")
      .references(() => contributions.subcategory)
      .notNull(),
    ecosystem: text("ecosystem")
      .references(() => projects.ecosystem)
      .notNull(),
    attestationUID: text("attestationUID").notNull().unique(),
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
    category: text("category")
      .references(() => projects.category)
      .notNull(),
    subcategory: text("subcategory")
      .references(() => contributions.subcategory)
      .notNull(),
    ecosystem: text("ecosystem")
      .references(() => projects.ecosystem)
      .notNull(),
    attestationUID: text("attestationUID").notNull().unique(),
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
