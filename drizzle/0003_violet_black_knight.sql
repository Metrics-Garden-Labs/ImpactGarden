ALTER TABLE "contributionAttestations" ADD COLUMN "ecosystem" text NOT NULL;--> statement-breakpoint
ALTER TABLE "contributions" ADD COLUMN "ecosystem" text NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "ecosystem" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contributionAttestations" ADD CONSTRAINT "contributionAttestations_ecosystem_contributions_ecosystem_fk" FOREIGN KEY ("ecosystem") REFERENCES "contributions"("ecosystem") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contributions" ADD CONSTRAINT "contributions_ecosystem_projects_ecosystem_fk" FOREIGN KEY ("ecosystem") REFERENCES "projects"("ecosystem") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
