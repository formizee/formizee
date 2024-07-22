ALTER TABLE "keys" DROP CONSTRAINT "keys_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "keys" DROP COLUMN IF EXISTS "user_id";