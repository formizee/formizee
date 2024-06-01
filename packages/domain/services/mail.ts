import {type Response, type Mail} from '../models';
import {type Uid} from '../models/values';

export interface MailService {
  send: (mail: Mail) => Promise<Response<Uid>>;
}
