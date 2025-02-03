import type {InsertError, QueryError} from './error';
import type {Result} from '@formizee/error';
import type {z} from 'zod';

export interface Querier {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  query<TIn extends z.ZodSchema<any>, TOut extends z.ZodSchema<any>>(req: {
    // The SQL query to run.
    // Use {paramName: Type} to define parameters
    // Example: `SELECT * FROM table WHERE id = {id: String}`
    query: string;
    // The schema of the parameters
    // Example: z.object({ id: z.string() })
    params?: TIn;
    // The schema of the output of each row
    // Example: z.object({ id: z.string() })
    schema: TOut;
  }): (params: z.input<TIn>) => Promise<Result<z.output<TOut>[], QueryError>>;
}

export interface Inserter {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  insert<TSchema extends z.ZodSchema<any>>(req: {
    table: string;
    schema: TSchema;
  }): (
    events: z.input<TSchema> | z.input<TSchema>[]
  ) => Promise<Result<{executed: boolean; query_id: string}, InsertError>>;
}
