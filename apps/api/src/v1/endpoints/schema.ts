import {schema} from '@formizee/db';
import {z} from '@hono/zod-openapi';
import {env} from '@/lib/enviroment';

export const ParamsSchema = z.object({
  id: z
    .string()
    .regex(/^[a-zA-Z]+_[a-zA-Z0-9]+$/, {
      message: 'Invalid identifier, please check that is correctly typed.'
    })
    .openapi({
      description: 'The id of the endpoint',
      example: 'enp_4VjHrJoEwAFC6itz8oUBW9NW2bia'
    })
});

export const EndpointSchema = z.object({
  id: z.string().openapi({
    description: 'The id of the endpoint',
    example: 'enp_4VjHrJoEwAFC6itz8oUBW9NW2bia'
  }),
  workspaceId: z.string().openapi({
    description: 'The id of the workspace',
    example: 'enp_4VjHrJoEwAFC6itz8oUBW9NW2bia'
  }),
  slug: z
    .string()
    .min(4, {message: 'The slug must be between 4 and 64 characters long.'})
    .max(64, {message: 'The slug must be between 4 and 64 characters long.'})
    .regex(/^[a-z0-9.-]+$/, {
      message:
        'The slug must contain only lowercase letters, numbers adn hyphens, with no space or special characters.'
    })
    .openapi({
      description: 'The slug of the endpoint',
      example: 'my-endpoint'
    }),
  isEnabled: z.boolean().default(true).openapi({
    description:
      "The state of the endpoint. If is false, the endpoint don't receive more submissions",
    example: true,
    default: true
  }),
  emailNotifications: z.boolean().default(true).openapi({
    description:
      'The state of the email notifications. If is true, the endpoint will send a notification for each submission created',
    example: false,
    default: true
  }),
  redirectUrl: z
    .string()
    .url({
      message: 'Invalid redirect url, please check that is correctly typed.'
    })
    .default(`${env.WEB_URL}/thanks-you`)
    .openapi({
      description:
        'The redirect url of the endpoint. When a user send a submission through a form, will be redirected to this url.',
      example: 'https://example.com/thanks-you',
      default: 'https://formizee.com/thanks-you'
    }),
  targetEmails: z
    .string()
    .email({
      message: 'Invalid redirect url, please check that is correctly typed.'
    })
    .array()
    .default([])
    .openapi({
      example: ['example1@formizee.com', 'example2@formizee.com']
    }),
  icon: z.enum(schema.endpointIcon).default('file').openapi({
    description: 'The icon of the endpoint',
    default: 'file',
    example: 'bolt'
  }),
  color: z.enum(schema.endpointColor).default('gray').openapi({
    description: 'The color the endpoint icon',
    default: 'gray',
    example: 'pink'
  })
});
