ALTER TABLE "contributionAttestations" RENAME COLUMN "attestationType" TO "isdelegate";--> statement-breakpoint
ALTER TABLE "contributionAttestations" ALTER COLUMN "isdelegate" SET DATA TYPE boolean;--> statement-breakpoint
ALTER TABLE "contributionAttestations" ALTER COLUMN "isdelegate" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "contributionAttestations" ALTER COLUMN "isdelegate" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "contributionAttestations" ADD COLUMN "rating" text;--> statement-breakpoint
ALTER TABLE "contributionAttestations" ADD COLUMN "improvementareas" text;--> statement-breakpoint
ALTER TABLE "contributionAttestations" ADD COLUMN "extrafeedback" text;