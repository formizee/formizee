export class Uid {
  constructor(readonly value: string) {
    this.value = value;

    this.ensureValueIsDefined(this.value);
  }

  async ensureValueIsDefined(value: string): Promise<void> {
    if (!value || value.trim() === '') {
      throw new Error('ID token must be defined');
    }
  }
}
