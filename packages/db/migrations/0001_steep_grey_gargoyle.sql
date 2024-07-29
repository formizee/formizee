ALTER TYPE "member_permissions" ADD VALUE 'all';--> statement-breakpoint
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_endpoint_id_endpoints_id_fk";
--> statement-breakpoint
ALTER TABLE "keys" ALTER COLUMN "workspace_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_endpoint_id_endpoints_id_fk" FOREIGN KEY ("endpoint_id") REFERENCES "public"."endpoints"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "password";