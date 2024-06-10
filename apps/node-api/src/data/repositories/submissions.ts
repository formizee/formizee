import type {SubmissionsRepository as Repository} from 'domain/repositories';
import {Response, type Submission} from 'domain/models';
import type {Uid} from 'domain/models/values';
import {createSubmission} from '@/lib/utils';
import {db, eq, submissions} from '@drizzle/db';

export class SubmissionsRepository implements Repository {
  async loadAll(endpoint: Uid): Promise<Response<Submission[]>> {
    const data = await db.query.submissions.findMany({
      with: {endpoint: endpoint.value}
    });
    if (data.length < 1) {
      return Response.error('There is no submissions yet.', 404);
    }

    const response = data.map(submission => {
      return createSubmission(submission);
    });

    return Response.success(response);
  }

  async load(uid: Uid): Promise<Response<Submission>> {
    const data = await db.query.submissions.findFirst({with: {id: uid.value}});
    if (!data) return Response.error('Submission not found.', 404);

    const response = createSubmission(data);

    return Response.success(response);
  }

  async update(uid: Uid, isSpam: boolean): Promise<Response<Submission>> {
    const submission = await db.query.submissions.findFirst({
      with: {id: uid.value}
    });
    if (!submission) return Response.error('Submission not found.', 404);

    const data = await db
      .update(submissions)
      .set({isSpam})
      .where(eq(submissions.id, Number(uid.value)))
      .returning({updatedIsSpam: submissions.isSpam});
    if (!data[0]) {
      return Response.error("Submission status can't be updated", 500);
    }

    submission.isSpam = data[0].updatedIsSpam;
    const response = createSubmission(submission);

    return Response.success(response);
  }

  async save(
    endpoint: Uid,
    data: JSON,
    files?: string[]
  ): Promise<Response<Submission>> {
    const submission = await db
      .insert(submissions)
      .values({
        endpoint: endpoint.value,
        data,
        files
      })
      .returning();

    if (!submission[0]) {
      return Response.error("Submission can't be created.", 500);
    }

    const response = createSubmission(submission[0]);
    return Response.success(response);
  }

  async delete(uid: Uid): Promise<Response<true>> {
    const data = await db.query.submissions.findFirst({with: {id: uid.value}});
    if (!data) return Response.error('Submission not found.', 404);

    await db.delete(submissions).where(eq(submissions.id, Number(uid.value)));

    return Response.success(true);
  }
}
