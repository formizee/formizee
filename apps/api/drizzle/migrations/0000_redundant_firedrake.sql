CREATE TABLE `auth_tokens` (
	`email` text PRIMARY KEY NOT NULL,
	`token` integer NOT NULL,
	`expiresAt` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`email`) REFERENCES `users`(`email`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `endpoints` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(64) DEFAULT 'Untitled Form' NOT NULL,
	`submissions` text DEFAULT '[]' NOT NULL,
	`owner` text NOT NULL,
	`isEnabled` integer DEFAULT true,
	`emailNotifications` integer DEFAULT true,
	`redirectUrl` text DEFAULT '' NOT NULL,
	`targetEmail` text NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`owner`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`endpoint` text NOT NULL,
	`form` text NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`endpoint`) REFERENCES `endpoints`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(32) NOT NULL,
	`email` text(32) NOT NULL,
	`password` text(64) NOT NULL,
	`verified` integer DEFAULT false NOT NULL,
	`forms` text NOT NULL,
	`linkedEmails` text NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);