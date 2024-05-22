export class SecretsProvider {
  private static instance: SecretsProvider;
  private smtp: any;
  private db: any;

  private constructor() {}

  static getInstance(): SecretsProvider {
    if (!SecretsProvider.instance) {
      SecretsProvider.instance = new SecretsProvider();
    }

    return SecretsProvider.instance;
  }

  setSmtp(apiKey: string) {
    this.smtp = apiKey;
  }

  getSmtp(): string {
    if (!this.smtp) {
      throw new Error('Smtp key is not set');
    }

    return this.smtp;
  }

  setDb(db: any) {
    this.db = db;
  }

  getDb() {
    if (!this.db) {
      throw new Error('Database is not set');
    }

    return this.db;
  }
}
