CREATE TABLE IF NOT EXISTS "contributionAttestations" (
	"id" serial PRIMARY KEY NOT NULL,
	"userFid" text NOT NULL,
	"contribution" text NOT NULL,
	"attestationUID" text NOT NULL,
	"attesterAddy" text NOT NULL,
	"attestationType" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contributions" (
	"id" serial PRIMARY KEY NOT NULL,
	"userFid" text NOT NULL,
	"projectName" text NOT NULL,
	"contribution" text NOT NULL,
	"desc" text NOT NULL,
	"link" text NOT NULL,
	"ethAddress" text NOT NULL,
	CONSTRAINT "contributions_contribution_unique" UNIQUE("contribution")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"userFid" text NOT NULL,
	"ethAddress" text NOT NULL,
	"projectName" text NOT NULL,
	"websiteUrl" text,
	"twitterUrl" text,
	"githubUrl" text,
	"logoUrl" text,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "cont_attest_id_idx" ON "contributionAttestations" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "cont_user_fid_idx" ON "contributions" ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "projects_user_id_idx" ON "projects" ("id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contributionAttestations" ADD CONSTRAINT "contributionAttestations_userFid_users_fid_fk" FOREIGN KEY ("userFid") REFERENCES "users"("fid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contributionAttestations" ADD CONSTRAINT "contributionAttestations_contribution_contributions_contribution_fk" FOREIGN KEY ("contribution") REFERENCES "contributions"("contribution") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contributions" ADD CONSTRAINT "contributions_userFid_users_fid_fk" FOREIGN KEY ("userFid") REFERENCES "users"("fid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contributions" ADD CONSTRAINT "contributions_projectName_projects_projectName_fk" FOREIGN KEY ("projectName") REFERENCES "projects"("projectName") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contributions" ADD CONSTRAINT "contributions_ethAddress_projects_ethAddress_fk" FOREIGN KEY ("ethAddress") REFERENCES "projects"("ethAddress") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_userFid_users_fid_fk" FOREIGN KEY ("userFid") REFERENCES "users"("fid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
