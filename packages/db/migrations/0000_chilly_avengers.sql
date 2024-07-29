DO $$ BEGIN
 CREATE TYPE "public"."workspace_plans" AS ENUM('hobby', 'pro', 'enterprise');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
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
DO $$ BEGIN
 CREATE TYPE "public"."member_permissions" AS ENUM('read', 'edit', 'create');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."workspace_role" AS ENUM('owner', 'admin', 'member');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"endpoint_id" text NOT NULL,
	"data" jsonb NOT NULL,
	"is_spam" boolean DEFAULT false NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workspaces" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"available_emails" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"plan" "workspace_plans" DEFAULT 'hobby' NOT NULL,
	"subscription_id" text,
	"stripe_id" text,
	"ends_at" timestamp,
	"paid_until" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "workspaces_slug_unique" UNIQUE("slug"),
	CONSTRAINT "workspaces_stripe_id_unique" UNIQUE("stripe_id"),
	CONSTRAINT "slug" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "endpoints" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"slug" text NOT NULL,
	"icon" "icons" DEFAULT 'file' NOT NULL,
	"color" "colors" DEFAULT 'gray' NOT NULL,
	"is_enabled" boolean DEFAULT true NOT NULL,
	"email_notifications" boolean DEFAULT true NOT NULL,
	"target_emails" text[] NOT NULL,
	"redirect_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "endpoints_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"password" text NOT NULL,
	"email" text NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"last_access" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_slug_unique" UNIQUE("slug"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "slug" UNIQUE("slug"),
	CONSTRAINT "email" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_to_emails" (
	"user_id" text NOT NULL,
	"email" text NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_to_workspaces" (
	"user_id" text NOT NULL,
	"workspace_id" text NOT NULL,
	"role" "workspace_role" DEFAULT 'member' NOT NULL,
	"permissions" "member_permissions" DEFAULT 'read' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "keys" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"hash" text NOT NULL,
	"user_id" text NOT NULL,
	"workspace_id" text,
	"last_access" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_endpoint_id_endpoints_id_fk" FOREIGN KEY ("endpoint_id") REFERENCES "public"."endpoints"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "endpoints" ADD CONSTRAINT "endpoints_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_emails" ADD CONSTRAINT "users_to_emails_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_workspaces" ADD CONSTRAINT "users_to_workspaces_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_workspaces" ADD CONSTRAINT "users_to_workspaces_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "keys" ADD CONSTRAINT "keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "keys" ADD CONSTRAINT "keys_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "hash" ON "keys" USING btree ("hash");