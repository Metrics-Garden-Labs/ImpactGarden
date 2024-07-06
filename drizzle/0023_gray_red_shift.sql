ALTER TABLE "projects" ADD COLUMN "primaryprojectuid" text;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_primaryprojectuid_unique" UNIQUE("primaryprojectuid");