import type { D1Database } from "@cloudflare/workers-types";

export class SecretsProvider {
  private static instance: SecretsProvider = new SecretsProvider();
  private db: D1Database | null = null;
  private smtp: string | null = null;

  static getInstance(): SecretsProvider {
    return SecretsProvider.instance;
  }

  setSmtp(apiKey: string): void {
    this.smtp = apiKey;
  }

  getSmtp(): string {
    if (!this.smtp) {
      throw new Error('Smtp key is not set');
    }

    return this.smtp;
  }

  setDb(db: D1Database): void {
    this.db = db;
  }

  getDb(): D1Database {
    if (!this.db) {
      throw new Error('Database is not set');
    }

    return this.db;
  }
}
