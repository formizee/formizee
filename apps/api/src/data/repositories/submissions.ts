import {type DrizzleD1Database, drizzle} from 'drizzle-orm/d1';
import {type SubmissionsRepository} from 'domain/repositories';
import {Response, Submission} from 'domain/models';
import {type Identifier} from 'domain/models/values';
import {eq} from 'drizzle-orm';
import {SecretsProvider} from '@/lib/secrets';
import {objectToFormData, formDataToObject} from '@/lib/adapters';
import {submissions} from '@/data/models';

export class SubmissionsRepositoryImplementation
  implements SubmissionsRepository
{
  private readonly db: DrizzleD1Database;

  constructor() {
    const provider = SecretsProvider.getInstance();
    this.db = drizzle(provider.getDb());
  }

  async load(uid: Identifier): Promise<Response<Submission>> {
    const response = await this.db
      .select()
      .from(submissions)
      .where(eq(submissions.id, uid.value));
    if (!response[0]) return Response.error('Submission not found.', 404);

    const formData = objectToFormData(JSON.parse(response[0].formData));

    const submission = new Submission(
      response[0].id,
      response[0].endpoint,
      response[0].timestamp,
      formData
    );

    return Response.success(submission);
  }

  async loadByForm(form: Identifier): Promise<Response<Submission[]>> {
    const response = await this.db
      .select()
      .from(submissions)
      .where(eq(submissions.endpoint, form.value));
    if (!response[0]) return Response.error('No submission found.', 404);

    const result: Submission[] = [];
    for (let i = 0; i <= response.length; i++) {
      const formData = objectToFormData(JSON.parse(response[0].formData));
      const item = new Submission(
        response[0].id,
        response[0].endpoint,
        response[0].timestamp,
        formData
      );

      result.push(item);
    }

    return Response.success(result);
  }

  async save(form: Identifier, data: FormData): Promise<Response<Submission>> {
    const formDataObject = await formDataToObject(data);
    const formData = JSON.stringify(formDataObject);

    const response = await this.db
      .insert(submissions)
      .values({
        endpoint: form.value,
        formData
      })
      .returning();

    if (!response[0]) return Response.error('Internal error.', 500);

    const submission = new Submission(
      response[0].id,
      response[0].endpoint,
      response[0].timestamp,
      data
    );

    return Response.success(submission);
  }

  async delete(uid: Identifier): Promise<Response<true>> {
    const exists = await this.db
      .select()
      .from(submissions)
      .where(eq(submissions.id, uid.value));
    if (!exists[0]) return Response.error('Submission not found.', 404);

    const deleted = await this.db
      .delete(submissions)
      .where(eq(submissions.id, uid.value))
      .returning();
    if (!deleted[0]) return Response.error('Internal error.', 500);

    return Response.success(true);
  }
}
