import {type Submission, SubmissionSchema} from '@/v1/submissions/schema';
import {HTTPException} from 'hono/http-exception';
import {decode, encode} from 'msgpack-lite';
import type {DataSchema} from './types';
import {validateData} from './schemas';

export const getSubmission = async (
  key: string,
  vault: KVNamespace,
  throwOnNotFound = false
): Promise<Submission> => {
  const submission = await vault.get(key, 'arrayBuffer');

  if (!submission) {
    if (throwOnNotFound) {
      throw new HTTPException(404, {message: 'Submission not found'});
    }

    return SubmissionSchema.parse({
      id: key.split(':')[1],
      data: {}
    });
  }

  try {
    const buffer = new Uint8Array(submission);
    return SubmissionSchema.parse({
      id: key.split(':')[1],
      data: decode(buffer)
    });
  } catch {
    throw new HTTPException(500, {
      message:
        "The submission can't be decoded, please contact with support@formizee.com"
    });
  }
};

export const uploadSubmission = async (
  key: string,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  data: Record<string, any>,
  schema: DataSchema,
  vault: KVNamespace
) => {
  const submissionValid = validateData(data, schema);

  if (!submissionValid) {
    throw new HTTPException(403, {
      message:
        'The submission structure does not match with the current data structure of the endpoint'
    });
  }

  const submission = encode(data);
  await vault.put(key, submission);
};
