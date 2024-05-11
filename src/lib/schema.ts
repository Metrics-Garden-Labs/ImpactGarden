//use the other table that i made for the other project

import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { useGlobalState } from "../config/config";

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

export const projects = pgTable(
  "projects",
  {
    id: serial("id").primaryKey(),
    userFid: text("userFid")
      .references(() => users.fid)
      .notNull(),
    ethAddress: text("ethAddress").notNull(),
    ecosystem: text("ecosystem").notNull(),
    projectName: text("projectName").unique().notNull(),
    oneliner: text("oneliner"),
    websiteUrl: text("websiteUrl"),
    twitterUrl: text("twitterUrl"),
    githubUrl: text("githubUrl"),
    logoUrl: text("logoUrl"),
    projectUid: text("projectUid").unique(),
    createdAt: timestamp("createdAt").defaultNow(),
  },
  (projects) => {
    return {
      userIdIdx: uniqueIndex("projects_user_id_idx").on(projects.id),
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
    secondaryecosystem: text("secondaryecosystem"),
    contribution: text("contribution").notNull().unique(),
    desc: text("desc").notNull(),
    link: text("link").notNull(),
    ethAddress: text("ethAddress")
      .references(() => projects.ethAddress)
      .notNull(),
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
  "contributionAttestations",
  {
    id: serial("id").primaryKey(),
    userFid: text("userFid")
      .references(() => users.fid)
      .notNull(),
    projectName: text("projectName")
      .references(() => projects.projectName)
      .notNull(),
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
  (contributionAttestations) => {
    return {
      contAttestIdIdx: uniqueIndex("cont_attest_id_idx").on(
        contributionAttestations.id
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
