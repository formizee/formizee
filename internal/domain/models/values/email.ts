export class Email {
  private readonly validEmailRegex = new RegExp(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

  constructor(readonly value: string) {
    this.value = value;

    this.ensureValueIsDefined(this.value);
    this.ensureIsValidEmail(this.value);
  }

  ensureValueIsDefined(value: string): void {
    if (!value || value.trim() === '') {
      throw new Error('Email address must be defined');
    }
  }

  ensureIsValidEmail(value: string): void {
    if (!this.validEmailRegex.test(value)) {
      throw new Error(`${value} is not a valid email address.`);
    }
  }
}
