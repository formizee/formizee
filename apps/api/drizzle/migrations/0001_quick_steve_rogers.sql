ALTER TABLE `users` ADD `is_verified` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `permission` text DEFAULT 'user' NOT NULL;