CREATE TABLE IF NOT EXISTS "governance_structures_op" (
	"id" serial PRIMARY KEY NOT NULL,
	"userfid" text NOT NULL,
	"ethaddress" text,
	"projectName" text NOT NULL,
	"contribution" text,
	"category" text NOT NULL,
	"subcategory" text NOT NULL,
	"ecosystem" text NOT NULL,
	"attestationUID" text NOT NULL,
	"feeling_if_didnt_exist" text,
	"explanation" text,
	"examples_of_usefulness" text,
	"private_feedback" text,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "governance_structures_op" ADD CONSTRAINT "governance_structures_op_userfid_users_fid_fk" FOREIGN KEY ("userfid") REFERENCES "public"."users"("fid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "governance_structures_op" ADD CONSTRAINT "governance_structures_op_projectName_projects_projectName_fk" FOREIGN KEY ("projectName") REFERENCES "public"."projects"("projectName") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "governance_structures_op" ADD CONSTRAINT "governance_structures_op_contribution_contributions_contribution_fk" FOREIGN KEY ("contribution") REFERENCES "public"."contributions"("contribution") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "governance_structures_op" ADD CONSTRAINT "governance_structures_op_category_projects_category_fk" FOREIGN KEY ("category") REFERENCES "public"."projects"("category") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "governance_structures_op" ADD CONSTRAINT "governance_structures_op_subcategory_contributions_subcategory_fk" FOREIGN KEY ("subcategory") REFERENCES "public"."contributions"("subcategory") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "governance_structures_op" ADD CONSTRAINT "governance_structures_op_ecosystem_projects_ecosystem_fk" FOREIGN KEY ("ecosystem") REFERENCES "public"."projects"("ecosystem") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "governance_structures_op_idx" ON "governance_structures_op" USING btree ("id");