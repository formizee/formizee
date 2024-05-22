import {Response, Mail} from '@/models';
import {Uid} from '@/models/values';

export interface MailService {
  send(mail: Mail): Promise<Response<Uid>>;
}
