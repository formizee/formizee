import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {fileUpload} from './file-upload';
import {z} from 'zod';

export const insertFileUploadSchema = createInsertSchema(fileUpload, {
  id: z.string().regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
    message: 'Invalid identifier, please check that is correctly typed.'
  }),
  fileKey: z.string(),
  submissionId: z.string().regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
    message:
      'Invalid submission identifier, please check that is correctly typed.'
  }),
  endpointId: z.string().regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
    message:
      'Invalid endpoint identifier, please check that is correctly typed.'
  })
});

export const selectFileUploadSchema = createSelectSchema(fileUpload);

export type InsertFileUpload = z.infer<typeof insertFileUploadSchema>;
export type FileUpload = z.infer<typeof selectFileUploadSchema>;
