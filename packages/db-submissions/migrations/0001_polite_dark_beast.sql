ALTER TABLE `file_uploads` RENAME COLUMN `workspace_id` TO `endpoint_id`;--> statement-breakpoint
ALTER TABLE `submissions` RENAME COLUMN `data` TO `data_cipher_text`;--> statement-breakpoint
ALTER TABLE `submissions` ADD `data_iv` text NOT NULL;