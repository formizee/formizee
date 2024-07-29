export class Identifier {
  private readonly validUUID = new RegExp(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
  );

  constructor(readonly value: string) {
    this.value = value;

    this.ensureValueIsDefined(this.value);
  }

  ensureValueIsDefined(value: string): void {
    if (!value || value.trim() === '') {
      throw new Error('ID token must be defined');
    }
  }

  ensureIsValidUUID(value: string): void {
    if (!this.validUUID.test(value)) {
      throw new Error(`${this.value} is not a valid UUID.`);
    }
  }
}
