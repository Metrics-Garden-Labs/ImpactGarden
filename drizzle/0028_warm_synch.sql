ALTER TABLE "projects" DROP CONSTRAINT "projects_userFid_users_fid_fk";
--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "userFid" DROP NOT NULL;