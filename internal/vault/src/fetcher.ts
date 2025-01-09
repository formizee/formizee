import type {Fetcher} from '@cloudflare/workers-types';

export class FetchWrapper {
  private readonly fetcher: Fetcher | null;

  constructor(fetcher: Fetcher | null = null) {
    this.fetcher = fetcher; // Assign the custom fetcher if provided
  }

  async fetch(url: string, options = {}) {
    // Use fetcher if provided, otherwise fallback to the default fetch API
    if (this.fetcher) {
      return this.fetcher.fetch(url, options);
    }

    return fetch(url, options);
  }
}
