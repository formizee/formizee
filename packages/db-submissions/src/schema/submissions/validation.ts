import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {submission} from './submission';
import {z} from 'zod';

export const insertSubmissionSchema = createInsertSchema(submission, {
  id: z.string().regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
    message: 'Invalid identifier, please check that is correctly typed.'
  }),
  endpointId: z.string().regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
    message:
      'Invalid endpoint identifier, please check that is correctly typed.'
  }),

  iv: z.string(),
  cipherText: z.string(),

  location: z.string()
});
export const selectSubmissionSchema = createSelectSchema(submission);

export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = z.infer<typeof selectSubmissionSchema>;