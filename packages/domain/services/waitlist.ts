import type {Email} from '@/models/values';
import {Response} from '@/models';

export interface WaitlistService {
  join(email: Email): Promise<Response<true>>;
}

export type WaitlistResponse =
  | {
      error: null;
    }
  | {
      error: Error;
    };

export type WaitlistServiceJoin = (email: Email) => Promise<WaitlistResponse>;
