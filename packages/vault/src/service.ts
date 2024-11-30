import type {VaultOptions} from './types';
import {Submissions} from './submissions';
import {Endpoints} from './endpoints';

export class Vault {
  public readonly submissions: Submissions;
  public readonly endpoints: Endpoints;

  constructor(opts: VaultOptions) {
    this.submissions = new Submissions(opts);
    this.endpoints = new Endpoints(opts);
  }
}
