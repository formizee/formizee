import {BaseError} from '@formizee/error';

export class InsertError extends BaseError {
  public readonly code = 'INTERNAL_SERVER_ERROR';
  public readonly name = InsertError.name;
  public readonly retry = true;

  constructor(message: string) {
    super({message});
  }
}

export class QueryError extends BaseError<{query: string}> {
  public readonly code = 'INTERNAL_SERVER_ERROR';
  public readonly name = QueryError.name;
  public readonly retry = true;

  constructor(message: string, context: {query: string}) {
    super({message, context});
  }
}
