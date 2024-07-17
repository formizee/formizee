import type {ReactElement} from 'react';

export interface Email {
  template: ReactElement;
  subject: string;
  from: string;
  to: string;
}
