CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"fid" text NOT NULL,
	"username" text NOT NULL,
	"ethaddress" text,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "users_fid_unique" UNIQUE("fid")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "fid_unique_idx" ON "users" ("fid");