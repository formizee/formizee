CREATE TABLE `waitlist` (
	`email` text PRIMARY KEY NOT NULL,
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`email`) REFERENCES `users`(`email`) ON UPDATE no action ON DELETE no action
);
