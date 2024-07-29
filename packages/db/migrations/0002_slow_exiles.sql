ALTER TABLE "endpoints" DROP CONSTRAINT "endpoints_workspace_id_workspaces_id_fk";
--> statement-breakpoint
ALTER TABLE "users_to_emails" DROP CONSTRAINT "users_to_emails_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users_to_workspaces" DROP CONSTRAINT "users_to_workspaces_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users_to_workspaces" DROP CONSTRAINT "users_to_workspaces_workspace_id_workspaces_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "endpoints" ADD CONSTRAINT "endpoints_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_emails" ADD CONSTRAINT "users_to_emails_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_workspaces" ADD CONSTRAINT "users_to_workspaces_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_workspaces" ADD CONSTRAINT "users_to_workspaces_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
