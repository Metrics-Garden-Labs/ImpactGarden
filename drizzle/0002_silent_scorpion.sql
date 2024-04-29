ALTER TABLE "contributionAttestations" ADD COLUMN "createdAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "contributions" ADD COLUMN "createdAt" timestamp DEFAULT now();