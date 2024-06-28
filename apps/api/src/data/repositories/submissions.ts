import type {SubmissionsRepository as Repository} from 'domain/repositories';
import {Response, type Submission} from 'domain/models';
import type {Identifier} from 'domain/models/values';
import {createSubmission} from 'src/lib/models';
import {db, eq, and, submissions} from '@drizzle/db';

export class SubmissionsRepository implements Repository {
  async loadAll(endpoint: Identifier): Promise<Response<Submission[]>> {
    const data = await db.query.submissions.findMany({
      where: eq(submissions.endpoint, endpoint.value)
    });

    const response = data.map(submission => {
      return createSubmission(submission);
    });

    return Response.success(response);
  }

  async load(
    endpoint: Identifier,
    id: Identifier
  ): Promise<Response<Submission>> {
    const data = await db.query.submissions.findFirst({
      where: and(
        eq(submissions.id, id.value),
        eq(submissions.endpoint, endpoint.value)
      )
    });
    if (!data) return Response.error('Submission not found.', 404);

    const response = createSubmission(data);

    return Response.success(response);
  }

  async updateIsRead(
    endpoint: Identifier,
    id: Identifier,
    isRead: boolean
  ): Promise<Response<Submission>> {
    const submission = await db.query.submissions.findFirst({
      where: and(
        eq(submissions.id, id.value),
        eq(submissions.endpoint, endpoint.value)
      )
    });
    if (!submission) return Response.error('Submission not found.', 404);

    const data = await db
      .update(submissions)
      .set({isRead})
      .where(eq(submissions.id, id.value))
      .returning({updatedIsRead: submissions.isRead});
    if (!data[0]) {
      return Response.error("Submission status can't be updated", 500);
    }

    submission.isRead = data[0].updatedIsRead;
    const response = createSubmission(submission);

    return Response.success(response);
  }

  async updateIsSpam(
    endpoint: Identifier,
    id: Identifier,
    isSpam: boolean
  ): Promise<Response<Submission>> {
    const submission = await db.query.submissions.findFirst({
      where: and(
        eq(submissions.id, id.value),
        eq(submissions.endpoint, endpoint.value)
      )
    });
    if (!submission) return Response.error('Submission not found.', 404);

    const data = await db
      .update(submissions)
      .set({isSpam})
      .where(eq(submissions.id, id.value))
      .returning({updatedIsSpam: submissions.isSpam});
    if (!data[0]) {
      return Response.error("Submission status can't be updated", 500);
    }

    submission.isSpam = data[0].updatedIsSpam;
    const response = createSubmission(submission);

    return Response.success(response);
  }

  async save(
    endpoint: Identifier,
    data: object
  ): Promise<Response<Submission>> {
    const submission = await db
      .insert(submissions)
      .values({
        endpoint: endpoint.value,
        data
      })
      .returning();

    if (!submission[0]) {
      return Response.error("Submission can't be created.", 500);
    }

    const response = createSubmission(submission[0]);
    return Response.success(response);
  }

  async delete(endpoint: Identifier, id: Identifier): Promise<Response<true>> {
    const data = await db.query.submissions.findFirst({
      where: and(
        eq(submissions.id, id.value),
        eq(submissions.endpoint, endpoint.value)
      )
    });
    if (!data) return Response.error('Submission not found.', 404);

    await db.delete(submissions).where(eq(submissions.id, id.value));

    return Response.success(true, 201);
  }
}
