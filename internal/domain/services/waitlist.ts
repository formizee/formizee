import type {Response} from '../models';
import type {Email} from '../models/values';

export interface WaitlistService {
  join: (email: Email) => Promise<Response<true>>;
}
