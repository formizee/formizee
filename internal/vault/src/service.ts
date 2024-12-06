import type {VaultOptions} from './types';
import {Submissions} from './submissions';
import {Endpoints} from './endpoints';
import {Storage} from './storage';

export class Vault {
  public readonly submissions: Submissions;
  public readonly endpoints: Endpoints;
  public readonly storage: Storage;

  constructor(opts: VaultOptions) {
    this.submissions = new Submissions(opts);
    this.endpoints = new Endpoints(opts);
    this.storage = new Storage(opts);
  }
}
