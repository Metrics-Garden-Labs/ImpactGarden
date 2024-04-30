ALTER TABLE "contributionAttestations" ADD COLUMN "projectName" text;--> statement-breakpoint
ALTER TABLE "contributions" ADD COLUMN "easUid" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contributionAttestations" ADD CONSTRAINT "contributionAttestations_projectName_projects_projectName_fk" FOREIGN KEY ("projectName") REFERENCES "projects"("projectName") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "contributionAttestations" ADD CONSTRAINT "contributionAttestations_attestationUID_unique" UNIQUE("attestationUID");--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_projectName_unique" UNIQUE("projectName");