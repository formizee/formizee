export class Password {
  private readonly MIN_LENGTH = 8;
  private readonly MAX_LENGTH = 32;

  constructor(readonly value: string) {
    this.value = value;

    this.ensureValueIsDefined(this.value);
    this.ensureIsValidLength(this.value);
    this.ensureContainsUppercase(this.value);
    this.ensureContainsLowercase(this.value);
    this.ensureContainsNumber(this.value);
    this.ensureContainsSpecialCharacter(this.value);
  }

  ensureValueIsDefined(value: string): void {
    if (!value || value.trim() === '') {
      throw new Error('Password must be defined');
    }
  }

  ensureIsValidLength(value: string): void {
    if (value.length < this.MIN_LENGTH || value.length > this.MAX_LENGTH) {
      throw new Error('Password must be between 8 and 32 characters long');
    }
  }

  ensureContainsUppercase(value: string): void {
    if (!/[A-Z]/.test(value)) {
      throw new Error('Password must contain at least one uppercase letter');
    }
  }

  ensureContainsLowercase(value: string): void {
    if (!/[a-z]/.test(value)) {
      throw new Error('Password must contain at least one lowercase letter');
    }
  }

  ensureContainsNumber(value: string): void {
    if (!/\d/.test(value)) {
      throw new Error('Password must contain at least one number');
    }
  }

  ensureContainsSpecialCharacter(value: string): void {
    if (!/[@$!%*?&]/.test(value)) {
      throw new Error(
        'Password must contain at least one special character (@, $, !, %, *, ?, or &)'
      );
    }
  }
}
