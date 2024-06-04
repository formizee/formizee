import { z } from 'zod';

export const nameSchema = z.object({
  name: z.string().min(4).max(32)
});

export const emailSchema = z.object({
  email: z.string().email()
});

export const linkedEmailsSchema = z.object({
  emails: z.array(z.string().email())
});

export const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be between 8 and 64 characters long' })
      .max(64, { message: 'Password must be between 8 and 32 characters long' })
  })
  .superRefine(({ password }, checkPassComplexity) => {
    const containsUppercase = (ch: string): boolean => /[A-Z]/.test(ch);

    const containsLowercase = (ch: string): boolean => /[a-z]/.test(ch);

    const containsSpecialChar = (ch: string): boolean =>
      /[`!@#$%^&*()_\-+=[\]{};':"|,.<>/?~ ]/.test(ch);

    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;

    for (let i = 0; i < password.length; i++) {
      const ch = password.charAt(i);
      if (!isNaN(Number(ch))) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
      else if (containsSpecialChar(ch)) countOfSpecialChar++;
    }
    if (
      countOfLowerCase < 1 ||
      countOfUpperCase < 1 ||
      countOfSpecialChar < 1 ||
      countOfNumbers < 1
    ) {
      checkPassComplexity.addIssue({
        code: 'custom',
        message:
          'Password must include uppercase, lowercase, numbers, and special characters.'
      });
    }
  });
