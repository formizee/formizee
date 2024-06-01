import type {Email} from '../models/values';
import {type Response} from '../models';

export interface WaitlistService {
  join: (email: Email) => Promise<Response<true>>;
}
