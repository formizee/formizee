import {ErrorCodeEnum, BaseError, Err, Ok, type Result} from '@formizee/error';
import {sha256} from '@formizee/hashing';
import {db, eq, schema} from '@formizee/db';
import {newKey} from '@formizee/keys';

class NotFoundError extends BaseError {
  public readonly name = 'Not Found';
  public readonly code = ErrorCodeEnum.enum.NOT_FOUND;
}

class UnauthorizedError extends BaseError {
  public readonly name = 'Unauthorized';
  public readonly code = ErrorCodeEnum.enum.UNAUTHORIZED;
}

class ProcessError extends BaseError {
  public readonly name = ProcessError.name;
  public readonly code = ErrorCodeEnum.enum.INTERNAL_SERVER_ERROR;
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
            message: 'The API key is not valid'
          })
        );
      }

      const isExpired = new Date() > key.expiresAt;
      if (isExpired) {
        await db.delete(schema.key).where(eq(schema.key.id, key.id));

        return Err(
          new UnauthorizedError({
            message: 'The API key is expired'
          })
        );
      }

      const workspace = await db.query.workspace.findFirst({
        where: (table, {eq}) => eq(table.id, key.workspaceId)
      });
      if (!workspace) {
        return Err(
          new NotFoundError({
            message: 'Workspace not found'
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

  public async createKey(
    expiracyDate: schema.KeyExpirationDate
  ): Promise<
    Result<{key: string; hash: string; expiresAt: Date}, ProcessError>
  > {
    try {
      const {key, hash} = await newKey();
      const expiresAt = this.generateExpiracyDate(expiracyDate);
      return Ok({
        key,
        hash,
        expiresAt
      });
    } catch (e) {
      const error = e as Error;
      return Err(
        new ProcessError({
          message: error.message
        })
      );
    }
  }

  private generateExpiracyDate(expiracyDate: schema.KeyExpirationDate): Date {
    const newDate = (days: number): Date => {
      return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    };

    switch (expiracyDate) {
      case '1-day':
        return newDate(1);
      case '7-days':
        return newDate(7);
      case '30-days':
        return newDate(30);
      case '60-days':
        return newDate(60);
      case '90-days':
        return newDate(90);
      case '180-days':
        return newDate(180);
      case '1-year':
        return newDate(365);
      case 'never':
        return newDate(999999);
      default:
        return newDate(1);
    }
  }

  private async hash(key: string): Promise<string> {
    const hash = await sha256(key);
    return hash;
  }
}
