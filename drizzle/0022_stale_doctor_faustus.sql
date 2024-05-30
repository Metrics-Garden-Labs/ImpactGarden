CREATE TABLE IF NOT EXISTS "op_delegates" (
	"id" serial PRIMARY KEY NOT NULL,
	"address" text NOT NULL,
	"twitter" text,
	"createdat" timestamp DEFAULT now(),
	CONSTRAINT "op_delegates_address_unique" UNIQUE("address")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "address_idx" ON "op_delegates" ("address");