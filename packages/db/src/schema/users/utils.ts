import type z from 'zod';

export const checkPasswordComplexity = (
  values: {password: string},
  checkPassComplexity: z.RefinementCtx
) => {
  const containsUppercase = (ch: string): boolean => /[A-Z]/.test(ch);

  const containsLowercase = (ch: string): boolean => /[a-z]/.test(ch);

  const containsSpecialChar = (ch: string): boolean =>
    /[`!@#$%^&*()_\-+=[\]{};':"|,.<>/?~ ]/.test(ch);

  let countOfUpperCase = 0;
  let countOfLowerCase = 0;
  let countOfNumbers = 0;
  let countOfSpecialChar = 0;

  for (let i = 0; i < values.password.length; i++) {
    const ch = values.password.charAt(i);
    if (!Number.isNaN(Number(ch))) {
      countOfNumbers++;
    } else if (containsUppercase(ch)) {
      countOfUpperCase++;
    } else if (containsLowercase(ch)) {
      countOfLowerCase++;
    } else if (containsSpecialChar(ch)) {
      countOfSpecialChar++;
    }
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
};
