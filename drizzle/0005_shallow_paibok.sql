ALTER TABLE "projects" ADD COLUMN "projectUid" text;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_projectUid_unique" UNIQUE("projectUid");