CREATE TABLE IF NOT EXISTS "userAddresses" (
	"id" serial PRIMARY KEY NOT NULL,
	"userFid" text NOT NULL,
	"ethAddress" text NOT NULL,
	"addressOrder" text NOT NULL,
	"coinbaseVerified" boolean DEFAULT false,
	"opBadgeHolder" boolean DEFAULT false,
	"powerBadgeHolder" boolean DEFAULT false,
	"createdAt" timestamp DEFAULT now(),
	CONSTRAINT "userAddresses_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_user_address_idx" ON "userAddresses" ("userFid","addressOrder","ethAddress");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userAddresses" ADD CONSTRAINT "userAddresses_userFid_users_fid_fk" FOREIGN KEY ("userFid") REFERENCES "users"("fid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
