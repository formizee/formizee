import {z} from '@hono/zod-openapi';

export const PostLoginSchema = z.object({
  email: z.string().email().openapi({
    example: 'example@formizee.com'
  }),
  password: z.string().openapi({
    example: 'vzyxXmHp2hm7!'
  })
});

export const PostRegisterSchema = z
  .object({
    name: z
      .string()
      .min(4, {message: 'Name must be between 4 and 32 characters long'})
      .max(32, {message: 'Name must be between 4 and 32 characters long'})
      .regex(/^[a-z0-9.-]+$/, {
        message: 'Name must only contain lowercase letters and numbers'
      })
      .openapi({example: 'pauchiner'}),
    email: z.string().email().openapi({example: 'example@formizee.com'}),
    password: z
      .string()
      .min(8, {message: 'Password must be between 8 and 64 characters long'})
      .max(64, {message: 'Password must be between 8 and 32 characters long'})
      .openapi({example: 'vzyxXmHp2hm7!'})
  })
  .superRefine(({password}, checkPassComplexity) => {
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

export const PostVerifySchema = z.object({
  token: z.string().length(6).regex(/^\d+$/).openapi({
    example: '123456'
  })
});

export const PostSendVerificationSchema = z.object({
  email: z.string().email().openapi({
    example: 'example@formizee.com'
  }),
  type: z.enum(['password', 'account']).openapi({
    example: 'account'
  })
});

export const PostLinkedEmailsSendVerificationSchema = z.object({
  email: z.string().email().openapi({
    example: 'example@formizee.com'
  })
});
export const PostVerifyLinkedEmailsSchema = z.object({
  token: z.string().openapi({
    example: '123456'
  })
});
