export class DatabaseProvider {
  private static instance: DatabaseProvider;
  private db: any;

  private constructor() {}

  static getInstance(): DatabaseProvider {
    if (!DatabaseProvider.instance) {
      DatabaseProvider.instance = new DatabaseProvider();
    }

    return DatabaseProvider.instance;
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
