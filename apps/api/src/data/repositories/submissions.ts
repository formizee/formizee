import { DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { SubmissionsRepository } from "domain/repositories";
import { DatabaseConfigProvider } from "@/lib/database";
import { Response, Submission } from 'domain/models';
import { Uid } from 'domain/models/values';

import { parseFormData, stringifyFormData } from "@/lib/models";
import { submissions } from '@/data/models/schema';
import { eq } from "drizzle-orm";

export class SubmissionsRepositoryImplementation implements SubmissionsRepository {
  private readonly db: DrizzleD1Database;

  constructor() {
    const configProvider = DatabaseConfigProvider.getInstance();
    const dbBinding = configProvider.getDb();
    this.db = drizzle(dbBinding);
  }

  async load(uid: Uid): Promise<Response<Submission>> {
    const response = await this.db.select().from(submissions).where(eq(submissions.id, uid.value))
    if (!response[0]) return Response.error('Submission not found.', 404);

    const formData = await parseFormData(response[0].formData);

    const submission = new Submission(
      response[0].id,
      response[0].endpoint,
      response[0].timestamp,
      formData
    )

    return Response.success(submission);
  }

  async loadByForm(form: Uid): Promise<Response<Submission[]>> {
    const response = await this.db.select().from(submissions).where(eq(submissions.endpoint, form.value))
    if (!response[0]) return Response.error('No submission found.', 404);

    let result: Submission[] = [];
    for(let i = 0; i <= response.length; i++) {
      const formData = await parseFormData(response[0].formData);
      const item = new Submission(response[0].id, response[0].endpoint, response[0].timestamp, formData)

      result.push(item);
    }

    return Response.success(result);
  }

  async save(form: Uid, data: FormData): Promise<Response<Submission>> {
    const formData = await stringifyFormData(data);

    const response = await this.db.insert(submissions).values({
      endpoint: form.value,
      formData
    }).returning();

    if (!response[0]) return Response.error('Internal error.', 500);

    const submission = new Submission(
      response[0].id,
      response[0].endpoint,
      response[0].timestamp,
      data
    )

    return Response.success(submission);
  }

  async delete(uid: Uid): Promise<Response<true>> {
    const exists = await this.db.select().from(submissions).where(eq(submissions.id, uid.value))
    if (!exists[0]) return Response.error('Submission not found.', 404);

    const deleted = await this.db.delete(submissions).where(eq(submissions.id, uid.value)).returning();
    if(!deleted[0]) return Response.error('Internal error.', 500);

    return Response.success(true);
  }
}
