import {text, integer, sqliteTable} from 'drizzle-orm/sqlite-core';
import {relations, sql} from 'drizzle-orm';
import {submission} from '../submissions';

export const fileUpload = sqliteTable('file_uploads', {
  id: text('id').primaryKey(),

  name: text('name').notNull(),

  fileKey: text('file_key').notNull(),

  submissionId: text('submission_id')
    .notNull()
    .references(() => submission.id, {onDelete: 'cascade'}),

  workspaceId: text('workspace_id').notNull(),

  createdAt: integer('created_at', {mode: 'timestamp'})
    .notNull()
    .default(sql`(unixepoch())`)
});

export const fileUploadsRelations = relations(fileUpload, ({one}) => ({
  submission: one(submission, {
    fields: [fileUpload.submissionId],
    references: [submission.id]
  })
}));
