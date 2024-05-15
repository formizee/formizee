export class Uid {
  constructor(readonly value: string) {
    this.value = value;

    this.ensureValueIsDefined(this.value);
  }

  ensureValueIsDefined(value: string): void {
    if (!value || value.trim() === '') {
      throw new Error('ID token must be defined');
    }
  }
}
