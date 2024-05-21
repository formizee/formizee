CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(32) NOT NULL,
	`email` text(32) NOT NULL,
	`password` text(64) NOT NULL,
	`forms` text NOT NULL,
	`linkedEmails` text NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);