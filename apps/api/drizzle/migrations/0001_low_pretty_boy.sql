DO $$ BEGIN
 CREATE TYPE "public"."colors" AS ENUM('gray', 'amber', 'red', 'lime', 'teal', 'cyan', 'indigo', 'violet', 'pink');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."icons" AS ENUM('file', 'file-chart', 'start', 'bookmark', 'heart', 'flag', 'bolt', 'bell', 'lightbulb', 'credit-card', 'stack', 'cube', 'database', 'server', 'inbox', 'calendar', 'mail', 'checkcircle', 'book', 'chat', 'user-group', 'console', 'tools', 'grid', 'moon', 'sun', 'cloud', 'cart', 'gift', 'music', 'beaker', 'video', 'code', 'maps', 'face-smile', 'face-frown', 'paint', 'bug', 'school', 'rocket');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "endpoints" ADD COLUMN "color" "colors" DEFAULT 'gray' NOT NULL;--> statement-breakpoint
ALTER TABLE "endpoints" ADD COLUMN "icon" "icons" DEFAULT 'file' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name_index" ON "teams" ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_index" ON "users" ("email");