CREATE TABLE IF NOT EXISTS "onchain_builders" (
	"id" serial PRIMARY KEY NOT NULL,
	"userfid" text NOT NULL,
	"ethaddress" text,
	"projectName" text NOT NULL,
	"contribution" text,
	"category" text NOT NULL,
	"subcategory" text NOT NULL,
	"ecosystem" text NOT NULL,
	"attestationUID" text NOT NULL,
	"recommend_contribution" text,
	"feeling_if_didnt_exist" text,
	"explanation" text,
	"private_feedback" text,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "onchain_builders" ADD CONSTRAINT "onchain_builders_userfid_users_fid_fk" FOREIGN KEY ("userfid") REFERENCES "public"."users"("fid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "onchain_builders" ADD CONSTRAINT "onchain_builders_projectName_projects_projectName_fk" FOREIGN KEY ("projectName") REFERENCES "public"."projects"("projectName") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "onchain_builders" ADD CONSTRAINT "onchain_builders_contribution_contributions_contribution_fk" FOREIGN KEY ("contribution") REFERENCES "public"."contributions"("contribution") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "onchain_builders" ADD CONSTRAINT "onchain_builders_category_projects_category_fk" FOREIGN KEY ("category") REFERENCES "public"."projects"("category") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "onchain_builders" ADD CONSTRAINT "onchain_builders_subcategory_contributions_subcategory_fk" FOREIGN KEY ("subcategory") REFERENCES "public"."contributions"("subcategory") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "onchain_builders" ADD CONSTRAINT "onchain_builders_ecosystem_projects_ecosystem_fk" FOREIGN KEY ("ecosystem") REFERENCES "public"."projects"("ecosystem") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "onchain_builders_idx" ON "onchain_builders" USING btree ("id");