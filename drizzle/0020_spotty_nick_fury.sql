ALTER TABLE "contributionAttestations" RENAME TO "contributionattestations";--> statement-breakpoint
ALTER TABLE "contributionattestations" DROP CONSTRAINT "contributionAttestations_attestationUID_unique";--> statement-breakpoint
ALTER TABLE "contributionattestations" DROP CONSTRAINT "contributionAttestations_userFid_users_fid_fk";
--> statement-breakpoint
ALTER TABLE "contributionattestations" DROP CONSTRAINT "contributionAttestations_projectName_projects_projectName_fk";
--> statement-breakpoint
ALTER TABLE "contributionattestations" DROP CONSTRAINT "contributionAttestations_contribution_contributions_contribution_fk";
--> statement-breakpoint
ALTER TABLE "contributionattestations" DROP CONSTRAINT "contributionAttestations_ecosystem_contributions_ecosystem_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contributionattestations" ADD CONSTRAINT "contributionattestations_userFid_users_fid_fk" FOREIGN KEY ("userFid") REFERENCES "users"("fid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contributionattestations" ADD CONSTRAINT "contributionattestations_projectName_projects_projectName_fk" FOREIGN KEY ("projectName") REFERENCES "projects"("projectName") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contributionattestations" ADD CONSTRAINT "contributionattestations_contribution_contributions_contribution_fk" FOREIGN KEY ("contribution") REFERENCES "contributions"("contribution") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contributionattestations" ADD CONSTRAINT "contributionattestations_ecosystem_contributions_ecosystem_fk" FOREIGN KEY ("ecosystem") REFERENCES "contributions"("ecosystem") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "contributionattestations" ADD CONSTRAINT "contributionattestations_attestationUID_unique" UNIQUE("attestationUID");