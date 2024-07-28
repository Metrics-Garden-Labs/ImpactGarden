CREATE TABLE IF NOT EXISTS "governance_collab_and_onboarding" (
	"id" serial PRIMARY KEY NOT NULL,
	"userfid" text NOT NULL,
	"ethaddress" text,
	"projectName" text NOT NULL,
	"category" text NOT NULL,
	"subcategory" text NOT NULL,
	"ecosystem" text NOT NULL,
	"attestationUID" text NOT NULL,
	"governance_knowledge" text,
	"recommend_contribution" text,
	"feeling_if_didnt_exist" text,
	"explanation" text,
	"private_feedback" text,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "governance_collab_and_onboarding_attestationUID_unique" UNIQUE("attestationUID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "governance_infra_and_tooling" (
	"id" serial PRIMARY KEY NOT NULL,
	"userfid" text NOT NULL,
	"ethaddress" text,
	"projectName" text NOT NULL,
	"category" text NOT NULL,
	"subcategory" text NOT NULL,
	"ecosystem" text NOT NULL,
	"attestationUID" text NOT NULL,
	"likely_to_recommend" text,
	"feeling_if_didnt_exist" text,
	"explanation" text,
	"private_feedback" text,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "governance_infra_and_tooling_attestationUID_unique" UNIQUE("attestationUID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "governance_r_and_a" (
	"id" serial PRIMARY KEY NOT NULL,
	"userfid" text NOT NULL,
	"ethaddress" text,
	"projectName" text NOT NULL,
	"category" text NOT NULL,
	"subcategory" text NOT NULL,
	"ecosystem" text NOT NULL,
	"attestationUID" text NOT NULL,
	"likely_to_recommend" text,
	"useful_for_understanding" text,
	"effective_for_improvements" text,
	"explanation" text,
	"private_feedback" text,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "governance_r_and_a_attestationUID_unique" UNIQUE("attestationUID")
);
--> statement-breakpoint
ALTER TABLE "contributions" ALTER COLUMN "link" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "contributions" ALTER COLUMN "ethAddress" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "contributions" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "contributions" ADD COLUMN "subcategory" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "category" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "governance_collab_and_onboarding" ADD CONSTRAINT "governance_collab_and_onboarding_userfid_users_fid_fk" FOREIGN KEY ("userfid") REFERENCES "public"."users"("fid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "governance_collab_and_onboarding" ADD CONSTRAINT "governance_collab_and_onboarding_projectName_projects_projectName_fk" FOREIGN KEY ("projectName") REFERENCES "public"."projects"("projectName") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "governance_collab_and_onboarding" ADD CONSTRAINT "governance_collab_and_onboarding_category_projects_category_fk" FOREIGN KEY ("category") REFERENCES "public"."projects"("category") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "governance_collab_and_onboarding" ADD CONSTRAINT "governance_collab_and_onboarding_subcategory_contributions_subcategory_fk" FOREIGN KEY ("subcategory") REFERENCES "public"."contributions"("subcategory") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "governance_collab_and_onboarding" ADD CONSTRAINT "governance_collab_and_onboarding_ecosystem_projects_ecosystem_fk" FOREIGN KEY ("ecosystem") REFERENCES "public"."projects"("ecosystem") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "governance_infra_and_tooling" ADD CONSTRAINT "governance_infra_and_tooling_userfid_users_fid_fk" FOREIGN KEY ("userfid") REFERENCES "public"."users"("fid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "governance_infra_and_tooling" ADD CONSTRAINT "governance_infra_and_tooling_projectName_projects_projectName_fk" FOREIGN KEY ("projectName") REFERENCES "public"."projects"("projectName") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "governance_infra_and_tooling" ADD CONSTRAINT "governance_infra_and_tooling_category_projects_category_fk" FOREIGN KEY ("category") REFERENCES "public"."projects"("category") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "governance_infra_and_tooling" ADD CONSTRAINT "governance_infra_and_tooling_subcategory_contributions_subcategory_fk" FOREIGN KEY ("subcategory") REFERENCES "public"."contributions"("subcategory") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "governance_infra_and_tooling" ADD CONSTRAINT "governance_infra_and_tooling_ecosystem_projects_ecosystem_fk" FOREIGN KEY ("ecosystem") REFERENCES "public"."projects"("ecosystem") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "governance_r_and_a" ADD CONSTRAINT "governance_r_and_a_userfid_users_fid_fk" FOREIGN KEY ("userfid") REFERENCES "public"."users"("fid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "governance_r_and_a" ADD CONSTRAINT "governance_r_and_a_projectName_projects_projectName_fk" FOREIGN KEY ("projectName") REFERENCES "public"."projects"("projectName") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "governance_r_and_a" ADD CONSTRAINT "governance_r_and_a_category_projects_category_fk" FOREIGN KEY ("category") REFERENCES "public"."projects"("category") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "governance_r_and_a" ADD CONSTRAINT "governance_r_and_a_subcategory_contributions_subcategory_fk" FOREIGN KEY ("subcategory") REFERENCES "public"."contributions"("subcategory") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "governance_r_and_a" ADD CONSTRAINT "governance_r_and_a_ecosystem_projects_ecosystem_fk" FOREIGN KEY ("ecosystem") REFERENCES "public"."projects"("ecosystem") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "governance_collab_and_onboarding_idx" ON "governance_collab_and_onboarding" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "governance_infra_and_tooling_idx" ON "governance_infra_and_tooling" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "governance_r_and_a_idx" ON "governance_r_and_a" USING btree ("id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contributions" ADD CONSTRAINT "contributions_category_projects_category_fk" FOREIGN KEY ("category") REFERENCES "public"."projects"("category") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
