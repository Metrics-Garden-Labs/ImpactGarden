ALTER TABLE "contributions" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "contributions" ADD COLUMN "subcategory" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "primaryprojectuid" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contributions" ADD CONSTRAINT "contributions_category_projects_category_fk" FOREIGN KEY ("category") REFERENCES "projects"("category") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_primaryprojectuid_unique" UNIQUE("primaryprojectuid");--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_projectUid_unique" UNIQUE("projectUid");