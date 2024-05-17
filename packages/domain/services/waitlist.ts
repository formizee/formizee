import type {Email} from '@/models/values';

export type Response =
  | {
      error: null;
    }
  | {
      error: Error;
    };

export type WaitlistServiceJoin = (email: Email) => Promise<Response>;
