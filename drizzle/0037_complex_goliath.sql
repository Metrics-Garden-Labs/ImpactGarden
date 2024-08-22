CREATE TABLE IF NOT EXISTS "op_stack" (
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
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "op_stack" ADD CONSTRAINT "op_stack_userfid_users_fid_fk" FOREIGN KEY ("userfid") REFERENCES "public"."users"("fid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "op_stack" ADD CONSTRAINT "op_stack_projectName_projects_projectName_fk" FOREIGN KEY ("projectName") REFERENCES "public"."projects"("projectName") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "op_stack" ADD CONSTRAINT "op_stack_contribution_contributions_contribution_fk" FOREIGN KEY ("contribution") REFERENCES "public"."contributions"("contribution") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "op_stack" ADD CONSTRAINT "op_stack_category_projects_category_fk" FOREIGN KEY ("category") REFERENCES "public"."projects"("category") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "op_stack" ADD CONSTRAINT "op_stack_subcategory_contributions_subcategory_fk" FOREIGN KEY ("subcategory") REFERENCES "public"."contributions"("subcategory") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "op_stack" ADD CONSTRAINT "op_stack_ecosystem_projects_ecosystem_fk" FOREIGN KEY ("ecosystem") REFERENCES "public"."projects"("ecosystem") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "opstack_idx" ON "op_stack" USING btree ("id");