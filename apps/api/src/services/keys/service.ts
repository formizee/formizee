import {ErrorCodeEnum, BaseError, Err, Ok, type Result} from '@formizee/error';
import {sha256} from '@formizee/hashing';
import {db, eq, schema} from '@formizee/db';

class NotFoundError extends BaseError {
  public readonly name = 'Not Found';
  public readonly code = ErrorCodeEnum.enum.NOT_FOUND;
}

class UnauthorizedError extends BaseError {
  public readonly name = 'Unauthorized';
  public readonly code = ErrorCodeEnum.enum.UNAUTHORIZED;
}

type Key = Omit<schema.Key, 'hash' | 'createdAt' | 'workspaceId'>;
type VerifyKeyError = NotFoundError | UnauthorizedError;
interface VerifyKeyResult extends Key {
  workspace: schema.Workspace;
}

export class KeyService {
  public async verifyKey(
    keyToVerify: string
  ): Promise<Result<VerifyKeyResult, VerifyKeyError>> {
    try {
      const hash = await this.hash(keyToVerify);

      const key = await db.query.key.findFirst({
        where: (table, {eq}) => eq(table.hash, hash)
      });
      if (!key) {
        return Err(
          new UnauthorizedError({
            message: 'The API key is not valid.'
          })
        );
      }

      const isExpired = new Date() > key.expiresAt;
      if (isExpired) {
        await db.delete(schema.key).where(eq(schema.key.id, key.id));

        return Err(
          new UnauthorizedError({
            message: 'The API key is expired.'
          })
        );
      }

      const workspace = await db.query.workspace.findFirst({
        where: (table, {eq}) => eq(table.id, key.workspaceId)
      });
      if (!workspace) {
        return Err(
          new NotFoundError({
            message: 'Workspace not found.'
          })
        );
      }

      await db
        .update(schema.key)
        .set({lastAccess: new Date()})
        .where(eq(schema.key.id, key.id));

      return Ok({
        id: key.id,
        name: key.name,
        workspace: workspace,
        lastAccess: key.lastAccess,
        expiresAt: key.expiresAt
      });
    } catch (e) {
      const error = e as Error;
      throw error;
    }
  }

  public async hash(key: string): Promise<string> {
    const hash = await sha256(key);
    return hash;
  }
}
