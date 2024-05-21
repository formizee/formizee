export class Name {
  private readonly MIN_LENGTH = 4;
  private readonly MAX_LENGTH = 32;

  private readonly validName = new RegExp(/^[a-z0-9.-]+$/);

  constructor(readonly value: string) {
    this.value = value;

    this.ensureValueIsDefined(this.value);
    this.ensureIsValidLength(this.value);
    this.ensureIsValidName(this.value);
  }

  ensureValueIsDefined(value: string): void {
    if (value === '') {
      throw new Error('Value must be defined');
    }
  }

  ensureIsValidLength(value: string): void {
    if (value.length < this.MIN_LENGTH || value.length > this.MAX_LENGTH) {
      throw new Error('Name must be between 4 and 20 characters long');
    }
  }

  ensureIsValidName(value: string): void {
    if (!this.validName.test(value)) {
      throw new Error(`${this.value} is not a valid name.`);
    }
  }
}
