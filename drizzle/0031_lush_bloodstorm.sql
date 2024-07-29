ALTER TABLE "governance_collab_and_onboarding" ADD COLUMN "contribution" text;--> statement-breakpoint
ALTER TABLE "governance_infra_and_tooling" ADD COLUMN "contribution" text;--> statement-breakpoint
ALTER TABLE "governance_r_and_a" ADD COLUMN "contribution" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "governance_collab_and_onboarding" ADD CONSTRAINT "governance_collab_and_onboarding_contribution_contributions_contribution_fk" FOREIGN KEY ("contribution") REFERENCES "public"."contributions"("contribution") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "governance_infra_and_tooling" ADD CONSTRAINT "governance_infra_and_tooling_contribution_contributions_contribution_fk" FOREIGN KEY ("contribution") REFERENCES "public"."contributions"("contribution") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "governance_r_and_a" ADD CONSTRAINT "governance_r_and_a_contribution_contributions_contribution_fk" FOREIGN KEY ("contribution") REFERENCES "public"."contributions"("contribution") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
