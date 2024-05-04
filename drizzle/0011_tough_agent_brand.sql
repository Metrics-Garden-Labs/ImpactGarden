ALTER TABLE "userAddresses" RENAME TO "user_addresses";--> statement-breakpoint
ALTER TABLE "user_addresses" RENAME COLUMN "userFid" TO "userfid";--> statement-breakpoint
ALTER TABLE "user_addresses" RENAME COLUMN "ethAddress" TO "ethaddress";--> statement-breakpoint
ALTER TABLE "user_addresses" RENAME COLUMN "addressOrder" TO "addressorder";--> statement-breakpoint
ALTER TABLE "user_addresses" DROP CONSTRAINT "userAddresses_id_unique";--> statement-breakpoint
ALTER TABLE "user_addresses" DROP CONSTRAINT "userAddresses_userFid_users_fid_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "unique_user_address_idx";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_user_address_idx" ON "user_addresses" ("userfid","addressorder","ethaddress");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_userfid_users_fid_fk" FOREIGN KEY ("userfid") REFERENCES "users"("fid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_id_unique" UNIQUE("id");