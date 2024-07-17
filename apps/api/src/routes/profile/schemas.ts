import {z} from '@hono/zod-openapi';

export const PatchProfileSchema = z
  .object({
    name: z
      .string()
      .min(4, {message: 'Name must be between 4 and 32 characters long'})
      .max(32, {message: 'Name must be between 4 and 32 characters long'})
      .regex(/^[a-z0-9.-]+$/, {
        message: 'Name must only contain lowercase letters and numbers'
      })
      .optional(),
    email: z.string().email().optional(),
    password: z
      .string()
      .min(8, {message: 'Password must be between 8 and 64 characters long'})
      .max(64, {message: 'Password must be between 8 and 32 characters long'})
      .optional()
  })
  .superRefine(({password}, checkPassComplexity) => {
    if (!password) {
      return;
    }

    const containsUppercase = (ch: string): boolean => /[A-Z]/.test(ch);

    const containsLowercase = (ch: string): boolean => /[a-z]/.test(ch);

    const containsSpecialChar = (ch: string): boolean =>
      /[`!@#$%^&*()_\-+=[\]{};':"|,.<>/?~ ]/.test(ch);

    let countOfUpperCase = 0;
    let countOfLowerCase = 0;
    let countOfNumbers = 0;
    let countOfSpecialChar = 0;

    for (let i = 0; i < password.length; i++) {
      const ch = password.charAt(i);
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
  });

export const DeleteProfileSchema = z.object({
  password: z.string().openapi({
    example: 'P4sSw0rd$'
  })
});

export const PostLinkedEmailsSchema = z.object({
  email: z.string().email().openapi({
    example: 'pauchiner@formizee.com'
  })
});

export const DeleteLinkedEmailsSchema = z.object({
  email: z
    .string()
    .email()
    .openapi({
      param: {
        name: 'email',
        in: 'path'
      },
      example: 'pauchiner@formizee.com'
    })
});
