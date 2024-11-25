PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_form_mappings` (
	`endpoint_id` text PRIMARY KEY NOT NULL,
	`database_id` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_form_mappings`("endpoint_id", "database_id") SELECT "endpoint_id", "database_id" FROM `form_mappings`;--> statement-breakpoint
DROP TABLE `form_mappings`;--> statement-breakpoint
ALTER TABLE `__new_form_mappings` RENAME TO `form_mappings`;--> statement-breakpoint
PRAGMA foreign_keys=ON;