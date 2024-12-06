import {createInsertSchema, createSelectSchema} from 'drizzle-zod';
import {submission} from './submission';
import {z} from 'zod';

export const insertSubmissionSchema = createInsertSchema(submission, {
  endpointId: z.string().regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
    message:
      'Invalid endpoint identifier, please check that is correctly typed.'
  })
});

export const selectSubmissionSchema = createSelectSchema(submission);

export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = z.infer<typeof selectSubmissionSchema>;
