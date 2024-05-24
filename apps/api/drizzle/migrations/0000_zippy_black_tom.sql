CREATE TABLE `auth_tokens` (
	`email` text PRIMARY KEY NOT NULL,
	`token` integer NOT NULL,
	`expires_at` text NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`email`) REFERENCES `users`(`email`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `endpoints` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(64) DEFAULT 'Untitled Form' NOT NULL,
	`owner` text NOT NULL,
	`form_enabled` integer DEFAULT true,
	`email_enabled` integer DEFAULT true,
	`target_mail` text NOT NULL,
	`redirect_url` text DEFAULT '' NOT NULL,
	`submissions` text DEFAULT '[]' NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`owner`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`endpoint` text NOT NULL,
	`form_data` text NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`endpoint`) REFERENCES `endpoints`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(32) NOT NULL,
	`email` text NOT NULL,
	`password` text(64) NOT NULL,
	`forms` text DEFAULT '[]' NOT NULL,
	`linked_emails` text NOT NULL,
	`verified` integer DEFAULT false NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `waitlist` (
	`email` text PRIMARY KEY NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);