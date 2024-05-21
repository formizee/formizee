export class DatabaseConfigProvider {
  private static instance: DatabaseConfigProvider;
  private db: any;

  private constructor() {}

  static getInstance(): DatabaseConfigProvider {
    if (!DatabaseConfigProvider.instance) {
      DatabaseConfigProvider.instance = new DatabaseConfigProvider();
    }

    return DatabaseConfigProvider.instance;
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
