CREATE TABLE `endpoints` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(64) DEFAULT 'Untitled Form' NOT NULL,
	`submissions` text DEFAULT '[]' NOT NULL,
	`owner` text,
	`isEnabled` integer DEFAULT true,
	`emailNotifications` integer DEFAULT true,
	`redirectUrl` text DEFAULT '',
	`targetEmail` text NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`owner`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`endpoint` text,
	`form` text NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`endpoint`) REFERENCES `endpoints`(`id`) ON UPDATE no action ON DELETE no action
);
