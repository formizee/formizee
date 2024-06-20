import {type Response, type Mail} from '../models';
import {type Identifier} from '../models/values';

export interface MailService {
  send: (mail: Mail) => Promise<Response<Identifier>>;
}
