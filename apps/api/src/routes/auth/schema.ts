import {z} from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(4, {message: 'Name must be between 4 and 32 characters long'})
      .max(32, {message: 'Name must be between 4 and 32 characters long'})
      .regex(/^[a-z0-9.-]+$/, {
        message: 'Name must only contain lowercase letters and numbers'
      }),
    email: z.string().email(),
    password: z
      .string()
      .min(8, {message: 'Password must be between 8 and 64 characters long'})
      .max(64, {message: 'Password must be between 8 and 32 characters long'})
  })
  .superRefine(({password}, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch);

    const containsLowercase = (ch: string) => /[a-z]/.test(ch);

    const containsSpecialChar = (ch: string) =>
      /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);

    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0,
      countOfSpecialChar = 0;

    for (let i = 0; i < password.length; i++) {
      let ch = password.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
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


export const sendVerificationSchema = z.object({
  email: z.string().email()
})

export const verifyUserSchema = z.object({
  email: z.string().email(),
  token: z.string().length(6).regex(/^\d+$/)
})
